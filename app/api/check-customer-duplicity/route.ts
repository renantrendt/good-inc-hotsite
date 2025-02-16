import { NextRequest, NextResponse } from 'next/server'
import { checkCustomerDuplicityBigQuery } from '@/utils/bigquery'
import { normalizeCPF } from '@/utils/cpf'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  // Log de início com timestamp
  const startTime = new Date().toISOString()
  console.log(` Iniciando verificação de duplicidade`)

  try {
    // Verificar credenciais BigQuery
    const credentialsPath = path.resolve(
      process.cwd(), 
      'credentials', 
      'datalake-vistobio-new-f5a5eccee454.json'
    )

    console.log(' Verificando arquivo de credenciais:', credentialsPath)
    console.log(' Arquivo existe:', fs.existsSync(credentialsPath))
    
    if (!fs.existsSync(credentialsPath)) {
      console.error(' ERRO: Arquivo de credenciais não encontrado')
      return NextResponse.json(
        { 
          error: 'Credenciais do BigQuery não configuradas',
          exists: false,
          duplicatedFields: []
        }, 
        { status: 500 }
      )
    }

    // Verificar permissões do arquivo
    try {
      fs.accessSync(credentialsPath, fs.constants.R_OK)
      console.log(' Arquivo de credenciais tem permissão de leitura')
    } catch (permError) {
      console.error(' Erro de permissão no arquivo de credenciais:', permError)
      return NextResponse.json(
        { 
          error: 'Sem permissão para acessar credenciais',
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
      console.log(' Corpo da requisição:', JSON.stringify(body, null, 2))
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
      email: email,
      phone: phone
    }

    console.log(' Parâmetros normalizados:', normalizedParams)

    // Verifica duplicidade no BigQuery
    let duplicityCheck;
    try {
      console.log(' Iniciando verificação de duplicidade')
      duplicityCheck = await checkCustomerDuplicityBigQuery({
        cpf: normalizedParams.cpf,
        email: normalizedParams.email,
        phone: normalizedParams.phone
      })
      console.log(' Verificação de duplicidade concluída:', JSON.stringify(duplicityCheck, null, 2))
    } catch (bigQueryError) {
      console.error(' Erro específico no BigQuery:', {
        message: bigQueryError instanceof Error ? bigQueryError.message : 'Erro desconhecido',
        stack: bigQueryError instanceof Error ? bigQueryError.stack : 'Sem stack trace',
        fullError: bigQueryError
      })

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

    console.log(' Resultado final:', JSON.stringify(duplicityCheck, null, 2))

    // Retorna resultado da verificação
    return NextResponse.json({
      exists: duplicityCheck.exists,
      duplicatedFields: duplicityCheck.duplicatedFields,
      customerData: duplicityCheck.customerData || null
    })

  } catch (error) {
    console.error(' Erro COMPLETO na verificação de duplicidade:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      fullError: error
    })
    
    return NextResponse.json(
      { 
        error: 'Erro interno na verificação de duplicidade', 
        details: error instanceof Error ? error.message : 'Unknown error',
        exists: false,
        duplicatedFields: []
      }, 
      { status: 500 }
    )
  }
}

// Desabilita cache para garantir verificação em tempo real
export const dynamic = 'force-dynamic'
