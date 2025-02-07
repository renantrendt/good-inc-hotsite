import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    console.log('Starting POST request to /api/leads')
    const data = await request.json()
    console.log('Received data:', JSON.stringify(data, null, 2))

    // Validar dados obrigatórios
    let requiredFields = [
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
        { status: 400 }
      )
    }

    console.log('All required fields present, checking for duplicates')

    // Verificar todos os campos que podem estar duplicados
    const duplicatedFields = []
    
    // Verificar email duplicado
    const existingEmail = await prisma.leadRegistration.findFirst({
      where: { email: data.email }
    })
    if (existingEmail) {
      duplicatedFields.push('email')
    }

    // Verificar telefone duplicado
    const existingPhone = await prisma.leadRegistration.findFirst({
      where: { phone: data.phone }
    })
    if (existingPhone) {
      duplicatedFields.push('phone')
    }

    // Verificar CPF duplicado (se fornecido)
    if (data.cpf) {
      const existingCPF = await prisma.leadRegistration.findFirst({
        where: { cpf: data.cpf }
      })
      if (existingCPF) {
        duplicatedFields.push('cpf')
      }
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
    
    // Log the exact data being sent to Prisma
    console.log('Data being sent to Prisma:', JSON.stringify({
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
    }, null, 2))

    const lead = await prisma.leadRegistration.create({
      data: {
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
      },
    })

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Error creating lead:', error)
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
    })
    
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