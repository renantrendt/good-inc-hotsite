import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const lead = await prisma.leadRegistration.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        clothesOdor: data.clothesOdor,
        productUnderstanding: data.productUnderstanding,
        mainFocus: data.mainFocus,
      },
    })

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}