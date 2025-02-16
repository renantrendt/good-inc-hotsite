import { getServiceSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { debug } from '../../../lib/debug'
import { checkCustomerDuplicityBigQuery } from '@/utils/bigquery'
import { sendFormNotification } from '@/utils/mailer';

export const dynamic = 'force-dynamic'

interface LeadFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  cpf?: string
  street: string
  number: string
  complement?: string
  neighborhood?: string
  city: string
  state: string
  zipCode: string
  country: string
  countryCode?: string
  cityCode?: string
  clothesOdor: string
  productUnderstanding: string
  mainFocus: string
  referral: string
}

interface LeadData {
  first_name: string
  last_name: string
  email: string
  phone: string
  cpf?: string
  street: string
  number: string
  complement?: string
  neighborhood?: string
  city: string
  state: string
  zip_code: string
  country: string
  country_code: string
  city_code: string
  clothes_odor: string
  product_understanding: string
  main_focus: string
  referral: string
}

export async function POST(request: Request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers, status: 204 })
  }
  try {
    debug.log('Leads', 'Starting POST request to /api/leads')
    const data = await request.json() as LeadFormData
    debug.log('Leads', 'Received data:', JSON.stringify(data, null, 2))

    // Validar dados obrigatórios
    const requiredFields: Array<keyof LeadFormData> = [
      // Dados pessoais
      'firstName', 'lastName', 'email', 'phone',
      // Endereço
      'street', 'city', 'state', 'zipCode', 'country',
      // Perfil
      'clothesOdor', 'productUnderstanding', 'mainFocus', 'referral'
    ]

    // Neighborhood and number are required only for Portuguese language
    const language = request.headers.get('Accept-Language') || 'en';
    if (language.startsWith('pt')) {
      requiredFields.push('neighborhood', 'number')
    }

    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      debug.error('Leads', 'Missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400, headers }
      )
    }

    debug.log('Leads', 'All required fields present, checking for duplicates')

    // Verificar todos os campos que podem estar duplicados
    // Verificar duplicatas e pedidos confirmados
    try {
      debug.log('Leads', 'Checking for duplicates and confirmed orders...')
      
      // Primeiro verifica duplicidade no Supabase
      const supabaseAdmin = getServiceSupabase()

      // Log detalhado antes da verificação de duplicidade
      debug.log('Leads', 'Checking duplicates and confirmed orders', {
        cpf: data.cpf,
        email: data.email,
        phone: data.phone
      })

      console.log(' DADOS RECEBIDOS:', JSON.stringify(data, null, 2))

      // Verifica duplicidade no BigQuery
      const bigQueryCheck = await checkCustomerDuplicityBigQuery({
        cpf: data.cpf,
        email: data.email,
        phone: data.phone
      })

      console.log(' BIGQUERY CHECK COMPLETO:', JSON.stringify(bigQueryCheck, null, 2))

      debug.log('Leads', 'BigQuery check result:', bigQueryCheck)
      
      // Se o cliente existe no BigQuery, bloqueia
      if (bigQueryCheck.exists) {
        console.log(' CLIENTE ENCONTRADO NO BIGQUERY:', JSON.stringify(bigQueryCheck.customerData, null, 2))
        debug.log('Leads', 'Customer found in BigQuery, blocking lead creation', {
          confirmedOrdersCount: bigQueryCheck.customerData?.confirmed_orders_count,
          customerData: bigQueryCheck.customerData,
          duplicatedFields: bigQueryCheck.duplicatedFields
        })
        return NextResponse.json(
          { 
            error: 'Existing customer', 
            details: bigQueryCheck.hasConfirmedOrders 
              ? 'Customer already has confirmed orders'
              : 'Customer already exists in our database',
            customerData: bigQueryCheck.customerData,
            duplicatedFields: bigQueryCheck.duplicatedFields
          },
          { status: 400, headers }
        )
      }

      // Verifica duplicidade no Supabase
      const duplicatedFields: string[] = []
      
      if (data.cpf) {
        const { data: cpfCheck, error: cpfError } = await supabaseAdmin
          .from('leads')
          .select('cpf')
          .eq('cpf', data.cpf.replace(/[.\-]/g, ''))
          .maybeSingle()

        if (cpfError) {
          debug.error('Leads', 'Error checking CPF duplicity:', cpfError)
          return NextResponse.json(
            { error: 'Error checking duplicates', details: cpfError },
            { status: 500, headers }
          )
        }

        if (cpfCheck) {
          duplicatedFields.push('cpf')
        }
      }

      if (data.email) {
        const { data: emailCheck, error: emailError } = await supabaseAdmin
          .from('leads')
          .select('email')
          .eq('email', data.email)
          .maybeSingle()

        if (emailError) {
          debug.error('Leads', 'Error checking email duplicity:', emailError)
          return NextResponse.json(
            { error: 'Error checking duplicates', details: emailError },
            { status: 500, headers }
          )
        }

        if (emailCheck) {
          duplicatedFields.push('email')
        }
      }

      if (data.phone) {
        const { data: phoneCheck, error: phoneError } = await supabaseAdmin
          .from('leads')
          .select('phone')
          .eq('phone', data.phone)
          .maybeSingle()

        if (phoneError) {
          debug.error('Leads', 'Error checking phone duplicity:', phoneError)
          return NextResponse.json(
            { error: 'Error checking duplicates', details: phoneError },
            { status: 500, headers }
          )
        }

        if (phoneCheck) {
          duplicatedFields.push('phone')
        }
      }

      debug.log('Leads', 'Duplicate check complete:', { duplicatedFields })

      if (duplicatedFields.length > 0) {
        return NextResponse.json(
          { 
            error: 'Duplicate lead found', 
            duplicatedFields 
          },
          { status: 400, headers }
        )
      }

      debug.log('Leads', 'No duplicates found, attempting to create lead')
      
      // Log the exact data being sent to Supabase
      const normalizedData: LeadData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf ? data.cpf.replace(/[.\-]/g, '') : undefined,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        country: data.country,
        country_code: data.countryCode,
        city_code: data.cityCode,
        clothes_odor: data.clothesOdor,
        product_understanding: data.productUnderstanding,
        main_focus: data.mainFocus,
        referral: data.referral
      }

      try {
        debug.log('Leads', 'Data being sent to Supabase:', JSON.stringify(normalizedData, null, 2))

        const supabaseAdmin = getServiceSupabase()
        const { data: lead, error } = await supabaseAdmin
          .from('leads')
          .insert([normalizedData])
          .select()
          .single()

        if (error) {
          debug.error('Leads', 'Error creating lead:', error)
          throw new Error(`Database error: ${error.message}`)
        }

        if (!lead) {
          throw new Error('Lead was not created')
        }

        debug.log('Leads', 'Lead created successfully:', lead)

        // Envia notificação por email
        try {
          await sendFormNotification(data);
          debug.log('Leads', 'Notification email sent successfully');
        } catch (emailError) {
          debug.error('Leads', 'Error sending notification email:', emailError);
          // Não vamos falhar a requisição se o email falhar
        }

        return NextResponse.json({ success: true, lead }, { headers })
      } catch (error) {
        debug.error('Leads', 'Error in lead creation:', error)
        return NextResponse.json(
          { 
            error: error instanceof Error ? error.message : 'Error creating lead',
            details: error
          },
          { status: 500, headers }
        )
      }
    } catch (error) {
      console.error('Error creating lead:', error)
      if (error instanceof Error) {
        debug.error('Leads', 'Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        })
      } else {
        debug.error('Leads', 'Unknown error:', error)
      }
      
      if (error instanceof Error) {
        // Se for um erro do Prisma, ele terá propriedades adicionais
        const prismaError = error as any
        if (prismaError.code) {
          console.error('Prisma error code:', prismaError.code)
          console.error('Prisma error meta:', prismaError.meta)
        }
        
        return NextResponse.json(
          { 
            error: error.message,
            details: prismaError.code ? {
              code: prismaError.code,
              meta: prismaError.meta
            } : undefined
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to create lead',
          details: error ? String(error) : undefined
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating lead:', error)
    if (error instanceof Error) {
      debug.error('Leads', 'Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      })
    } else {
      debug.error('Leads', 'Unknown error:', error)
    }
    
    if (error instanceof Error) {
      // Se for um erro do Prisma, ele terá propriedades adicionais
      const prismaError = error as any
      if (prismaError.code) {
        console.error('Prisma error code:', prismaError.code)
        console.error('Prisma error meta:', prismaError.meta)
      }
      
      return NextResponse.json(
        { 
          error: error.message,
          details: prismaError.code ? {
            code: prismaError.code,
            meta: prismaError.meta
          } : undefined
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create lead',
        details: error ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}