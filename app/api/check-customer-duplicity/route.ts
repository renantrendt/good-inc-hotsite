import { NextRequest, NextResponse } from 'next/server'
import { checkCustomerDuplicityBigQuery } from '@/utils/bigquery'


export async function POST(request: NextRequest) {
  // Log de início com timestamp
  const startTime = new Date().toISOString()
  console.log(` Iniciando verificação de duplicidade em ${startTime}`)

  try {
    // Verificar variáveis de ambiente do BigQuery
    if (!process.env.GCP_PROJECT_ID || !process.env.GCP_SERVICE_ACCOUNT_EMAIL || !process.env.GCP_PRIVATE_KEY) {
      console.error(' ERRO: Variáveis de ambiente do BigQuery não configuradas')
      return NextResponse.json(
        { 
          error: 'Credenciais do BigQuery não configuradas',
          exists: false,
          duplicatedFields: []
        }, 
        { status: 500 }
      )
    }

    // Parsear corpo da requisição com tratamento de erro
    let body;
    try {
      body = await request.json()
      console.log(' Corpo da requisição:', {
        hasCPF: !!body.cpf,
        hasEmail: !!body.email,
        hasPhone: !!body.phone
      })
    } catch (parseError) {
      console.error(' Erro ao parsear JSON:', parseError)
      return NextResponse.json(
        { 
          error: 'Corpo da requisição inválido', 
          details: 'Falha ao processar JSON',
          exists: false,
          duplicatedFields: []
        }, 
        { status: 400 }
      )
    }

    const { cpf, email, phone } = body

    // Validar campos de entrada
    if (!cpf && !email && !phone) {
      console.warn(' Nenhum campo de verificação fornecido')
      return NextResponse.json(
        { 
          error: 'Pelo menos um campo de verificação é necessário',
          exists: false,
          duplicatedFields: []
        }, 
        { status: 400 }
      )
    }

    // Normaliza parâmetros removendo pontuação
    const normalizedParams = {
      cpf: cpf ? cpf.replace(/[.\-]/g, '') : undefined,
      email,
      phone
    }

    console.log(' Parâmetros normalizados:', {
      hasCPF: !!normalizedParams.cpf,
      hasEmail: !!normalizedParams.email,
      hasPhone: !!normalizedParams.phone
    })

    // Verifica duplicidade no BigQuery
    let duplicityCheck;
    try {
      console.log(' Iniciando verificação de duplicidade no BigQuery')
      duplicityCheck = await checkCustomerDuplicityBigQuery(normalizedParams)
      console.log(' Verificação concluída:', {
        exists: duplicityCheck.exists,
        duplicatedFields: duplicityCheck.duplicatedFields,
        hasCustomerData: !!duplicityCheck.customerData
      })
    } catch (bigQueryError) {
      console.error(' Erro no BigQuery:', bigQueryError)
      return NextResponse.json(
        { 
          error: 'Falha na verificação de duplicidade', 
          details: bigQueryError instanceof Error ? bigQueryError.message : 'Erro desconhecido',
          exists: false,
          duplicatedFields: []
        }, 
        { status: 500 }
      )
    }

    // Retorna resultado da verificação
    return NextResponse.json({
      exists: duplicityCheck.exists,
      duplicatedFields: duplicityCheck.duplicatedFields,
      customerData: duplicityCheck.customerData || null
    })

  } catch (error) {
    console.error(' Erro geral na verificação:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno na verificação de duplicidade', 
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        exists: false,
        duplicatedFields: []
      }, 
      { status: 500 }
    )
  }
}

// Desabilita cache para garantir verificação em tempo real
export const dynamic = 'force-dynamic'
