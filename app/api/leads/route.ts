import { getServiceSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { debug } from '../../../lib/debug'

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
  country_code?: string
  city_code?: string
  clothes_odor: string
  product_understanding: string
  main_focus: string
  referral: string
}

import { sendFormNotification } from '@/utils/mailer';

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

    // Neighborhood and number are required only for Brazilian addresses
    if (data.country === 'Brasil') {
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
    const duplicatedFields: string[] = []
    
    // Verificar duplicatas
    try {
      debug.log('Leads', 'Checking for duplicates...')
      const supabaseAdmin = getServiceSupabase()

      // Primeiro verifica email
      const { data: emailCheck, error: emailError } = await supabaseAdmin
        .from('leads')
        .select('email')
        .eq('email', data.email)
        .maybeSingle()

      if (emailError) {
        debug.error('Leads', 'Error checking email:', emailError)
        throw new Error(`Database error: ${emailError.message}`)
      }

      if (emailCheck) duplicatedFields.push('email')

      // Depois verifica telefone
      const { data: phoneCheck, error: phoneError } = await supabaseAdmin
        .from('leads')
        .select('phone')
        .eq('phone', data.phone)
        .maybeSingle()

      if (phoneError) {
        debug.error('Leads', 'Error checking phone:', phoneError)
        throw new Error(`Database error: ${phoneError.message}`)
      }

      if (phoneCheck) duplicatedFields.push('phone')

      // Por fim, verifica CPF se fornecido
      if (data.cpf) {
        const { data: cpfCheck, error: cpfError } = await supabaseAdmin
          .from('leads')
          .select('cpf')
          .eq('cpf', data.cpf)
          .maybeSingle()

        if (cpfError) {
          debug.error('Leads', 'Error checking CPF:', cpfError)
          throw new Error(`Database error: ${cpfError.message}`)
        }

        if (cpfCheck) duplicatedFields.push('cpf')
      }

      debug.log('Leads', 'Duplicate check complete:', { duplicatedFields })
    } catch (error) {
      debug.error('Leads', 'Error in duplicate check:', error)
      return NextResponse.json(
        { 
          error: error instanceof Error ? error.message : 'Error checking for duplicates',
          details: error
        },
        { status: 500, headers }
      )
    }



    if (duplicatedFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Campos duplicados encontrados',
          duplicatedFields
        },
        { status: 400 }
      )
    }

    debug.log('Leads', 'No duplicates found, attempting to create lead')
    
    // Log the exact data being sent to Supabase
    const leadData: LeadData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
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
      debug.log('Leads', 'Data being sent to Supabase:', JSON.stringify(leadData, null, 2))

      const supabaseAdmin = getServiceSupabase()
      const { data: lead, error } = await supabaseAdmin
        .from('leads')
        .insert([leadData])
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
}