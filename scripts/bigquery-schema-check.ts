import { BigQuery } from '@google-cloud/bigquery'
import path from 'path'

async function checkTableSchema() {
  try {
    const keyFilePath = path.resolve(
      process.cwd(), 
      'credentials', 
      'datalake-vistobio-new-f5a5eccee454.json'
    )

    const bigquery = new BigQuery({
      keyFilename: keyFilePath,
      projectId: 'datalake-vistobio-new'
    })

    const dataset = bigquery.dataset('Vnda')
    const table = dataset.table('Clientes_Vnda')

    console.log('🔍 Verificando schema da tabela Clientes_Vnda...')

    // Obter metadados da tabela
    const [metadata] = await table.getMetadata()
    
    console.log('📋 Colunas da tabela:')
    metadata.schema.fields.forEach((field: { name: string, type: string }) => {
      console.log(`- ${field.name}: ${field.type}`)
    })

    // Consulta de exemplo para verificar nomes reais das colunas
    const query = `
      SELECT 
        column_name 
      FROM \`datalake-vistobio-new.Vnda.INFORMATION_SCHEMA.COLUMNS\`
      WHERE table_name = 'Clientes_Vnda'
    `

    const [rows] = await bigquery.query({ query, location: 'US' })
    
    console.log('\n🔬 Nomes completos das colunas:')
    rows.forEach(row => {
      console.log(`- ${row.column_name}`)
    })

  } catch (error) {
    console.error('❌ Erro ao verificar schema:', error)
  }
}

checkTableSchema()
