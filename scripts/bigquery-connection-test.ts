import { BigQuery } from '@google-cloud/bigquery'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Equivalente a __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function testBigQueryConnection() {
  try {
    const keyFilePath = path.resolve(
      __dirname, 
      'credentials', 
      'datalake-vistobio-new-f5a5eccee454.json'
    )

    console.log(' Verificando arquivo de credenciais...')
    console.log('Caminho do arquivo:', keyFilePath)

    // Verificar existência do arquivo
    if (!fs.existsSync(keyFilePath)) {
      console.error(' Erro: Arquivo de credenciais não encontrado!')
      console.error('Verifique o caminho:', keyFilePath)
      return
    }

    // Verificar permissões do arquivo
    try {
      fs.accessSync(keyFilePath, fs.constants.R_OK)
      console.log(' Arquivo de credenciais tem permissão de leitura')
    } catch (permError) {
      console.error(' Erro de permissão:', permError)
      return
    }

    console.log(' Iniciando conexão com BigQuery...')
    const bigquery = new BigQuery({
      keyFilename: keyFilePath,
      projectId: 'datalake-vistobio-new'
    })

    // Teste de consulta simples
    console.log(' Executando consulta de teste...')
    const query = 'SELECT 1 as test'
    const [rows] = await bigquery.query({ 
      query,
      location: 'US'
    })
    
    console.log(' Conexão BigQuery bem-sucedida!')
    console.log('Resultado do teste:', rows)

    // Teste de consulta na tabela específica
    console.log(' Testando consulta na tabela Clientes_Vnda...')
    const clientQuery = `
      SELECT COUNT(*) as total_clientes 
      FROM \`datalake-vistobio-new.Vnda.Clientes_Vnda\`
    `
    const [clientRows] = await bigquery.query({ 
      query: clientQuery,
      location: 'US'
    })

    console.log(' Consulta na tabela de clientes bem-sucedida!')
    console.log('Total de clientes:', clientRows[0].total_clientes)

  } catch (error) {
    console.error(' Erro COMPLETO na conexão BigQuery:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : 'Sem stack trace',
      fullError: error
    })
  }
}

// Executa o teste
testBigQueryConnection()
