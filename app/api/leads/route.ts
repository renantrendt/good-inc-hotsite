import { getServiceSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

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
    console.log('Starting POST request to /api/leads')
    const data = await request.json() as LeadFormData
    console.log('Received data:', JSON.stringify(data, null, 2))

    // Validar dados obrigatórios
    const requiredFields: Array<keyof LeadFormData> = [
      // Dados pessoais
      'firstName', 'lastName', 'email', 'phone',
      // Endereço
      'street', 'number', 'city', 'state', 'zipCode', 'country',
      // Perfil
      'clothesOdor', 'productUnderstanding', 'mainFocus'
    ]

    // Neighborhood is required only for Brazilian addresses
    if (data.country === 'Brasil') {
      requiredFields.push('neighborhood')
    }

    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400, headers }
      )
    }

    console.log('All required fields present, checking for duplicates')

    // Verificar todos os campos que podem estar duplicados
    const duplicatedFields: string[] = []
    
    // Verificar duplicatas em uma única query
    const conditions = [
      `email.eq.${JSON.stringify(data.email)}`,
      `phone.eq.${JSON.stringify(data.phone)}`
    ]
    
    if (data.cpf) {
      conditions.push(`cpf.eq.${JSON.stringify(data.cpf)}`)
    }

    const supabaseAdmin = getServiceSupabase()
    const { data: existingData, error: searchError } = await supabaseAdmin
      .from('LeadRegistration')
      .select('email, phone, cpf')
      .or(conditions.join(','))
      .limit(1)

    if (searchError) {
      console.error('Error checking for duplicates:', searchError)
      return NextResponse.json(
        { error: 'Error checking for duplicates' },
        { status: 500, headers }
      )
    }

    if (existingData && existingData.length > 0) {
      existingData.forEach(item => {
        if (item.email === data.email) duplicatedFields.push('email')
        if (item.phone === data.phone) duplicatedFields.push('phone')
        if (item.cpf === data.cpf) duplicatedFields.push('cpf')
      })
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

    console.log('No duplicates found, attempting to create lead')
    
    // Log the exact data being sent to Supabase
    const leadData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      countryCode: data.countryCode,
      cityCode: data.cityCode,
      clothesOdor: data.clothesOdor,
      productUnderstanding: data.productUnderstanding,
      mainFocus: data.mainFocus,
    }

    console.log('Data being sent to Supabase:', JSON.stringify(leadData, null, 2))

    const { data: lead, error } = await supabaseAdmin
      .from('LeadRegistration')
      .insert([leadData])
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return NextResponse.json({ error: error.message }, { status: 500, headers })
    }

    return NextResponse.json({ success: true, lead }, { headers })
  } catch (error) {
    console.error('Error creating lead:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      })
    } else {
      console.error('Unknown error:', error)
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