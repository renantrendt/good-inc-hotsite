import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Received data:', data) // Log para debug

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
        country: data.country,
        zipCode: data.zipCode,
        clothesOdor: data.clothesOdor,
        productUnderstanding: data.productUnderstanding,
        mainFocus: data.mainFocus,
        // Campos de endereço
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
        country: data.country || 'Brasil', // Valor padrão para Brasil
        countryCode: data.countryCode || '+55', // Valor padrão para Brasil
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