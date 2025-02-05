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
        countryCode: data.countryCode,
        cpf: data.cpf || null,
        // Shipping Address
        street: data.street,
        number: data.number,
        complement: data.complement || null,
        neighborhood: data.neighborhood || null,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
        // Profile Questions
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