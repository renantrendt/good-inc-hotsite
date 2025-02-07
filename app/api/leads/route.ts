import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Received data:', data) // Log para debug

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

    const lead = await prisma.leadRegistration.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        // Campos de endereço
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
        country: data.address.country,
        countryCode: data.countryCode,
        cityCode: data.cityCode,
        // Campos do perfil
        clothesOdor: data.clothesOdor,
        productUnderstanding: data.productUnderstanding,
        mainFocus: data.mainFocus,
      },
    })

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Error creating lead:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}