import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';
import fs from 'fs';

// Log de verificação de credenciais
const keyFilePath = path.resolve(
  process.cwd(), 
  'credentials', 
  'datalake-vistobio-new-f5a5eccee454.json'
);

console.log(' Caminho do arquivo de credenciais:', keyFilePath);
console.log(' Arquivo de credenciais existe:', fs.existsSync(keyFilePath));

// Verificação de permissão de leitura
try {
  fs.accessSync(keyFilePath, fs.constants.R_OK);
  console.log(' Arquivo de credenciais tem permissão de leitura');
} catch (permError) {
  console.error(' Erro de permissão no arquivo de credenciais:', permError);
}

let bigqueryClient: BigQuery | null = null;

try {
  bigqueryClient = new BigQuery({
    keyFilename: keyFilePath,
    projectId: 'datalake-vistobio-new'
  });
  console.log(' Cliente BigQuery inicializado com sucesso');
} catch (clientError) {
  console.error(' Erro ao criar cliente BigQuery:', clientError);
}

interface CustomerCheckResult {
  exists: boolean;
  message?: string;
  error?: any;
  customerData?: any;
}

export async function checkCustomerInBigQuery(cpf: string): Promise<CustomerCheckResult> {
  if (!bigqueryClient) {
    console.error(' Cliente BigQuery não inicializado');
    throw new Error('Cliente BigQuery não inicializado');
  }

  try {
    const query = `
      SELECT 
        COUNT(*) as count,
        ARRAY_AGG(t LIMIT 1) as customer_data
      FROM \`datalake-vistobio-new.Vnda.Clientes_Vnda\` t
      WHERE REGEXP_REPLACE(cpf, r'[^0-9]', '') = REGEXP_REPLACE(@cpf, r'[^0-9]', '')
    `;

    const options = {
      query,
      location: 'US',
      params: { 
        cpf, 
        table_name: 'Clientes_Vnda' 
      },
    };

    console.log('BigQuery Flexible Query:', query);
    console.log('BigQuery Params:', { cpf });

    const [rows] = await bigqueryClient.query(options);
    const exists = rows[0]?.count > 0;

    console.log('BigQuery Result:', {
      exists,
      count: rows[0]?.count,
      customerData: rows[0]
    });

    return {
      exists,
      message: exists 
        ? 'Cliente encontrado no BigQuery' 
        : 'Cliente não encontrado no BigQuery',
      customerData: exists ? rows[0] : null
    };
  } catch (error) {
    console.error('Erro ao consultar BigQuery:', error);
    return {
      exists: false,
      error,
      message: 'Erro ao consultar base de dados',
    };
  }
}

export async function checkCustomerDuplicityBigQuery(params: {
  cpf?: string, 
  email?: string, 
  phone?: string
}): Promise<{
  exists: boolean;
  duplicatedFields: string[];
  customerData?: any;
  hasConfirmedOrders: boolean;
}> {
  console.log(' Iniciando verificação de duplicidade no BigQuery')
  console.log(' Parâmetros recebidos:', JSON.stringify(params, null, 2))

  if (!bigqueryClient) {
    console.error(' Cliente BigQuery não inicializado');
    throw new Error('Cliente BigQuery não inicializado');
  }

  try {
    const { cpf, email, phone } = params

    // Validar se pelo menos um campo foi fornecido
    if (!cpf && !email && !phone) {
      console.warn(' Nenhum campo de verificação fornecido')
      throw new Error('Pelo menos um campo de verificação é necessário')
    }

    console.log(' Parâmetros de verificação:', { cpf, email, phone })

    // Construir condições dinâmicas
    const conditions: string[] = [];
    const queryParams: Record<string, string> = {};

    if (cpf) {
      conditions.push('REGEXP_REPLACE(cpf, r"[^0-9]", "") = REGEXP_REPLACE(@cpf, r"[^0-9]", "")')
      queryParams.cpf = cpf;
    }

    if (email) {
      conditions.push('email = @email')
      queryParams.email = email;
    }

    if (phone) {
      conditions.push(`
        COALESCE(
          phone, 
          JSON_EXTRACT_SCALAR(recent_address, '$.first_phone')
        ) = @phone
      `)
      queryParams.phone = phone;
    }

    const query = `
      SELECT 
        cpf, 
        first_name as nome, 
        email, 
        phone_area,
        phone,
        recent_address,
        confirmed_orders_count
      FROM \`datalake-vistobio-new.Vnda.Clientes_Vnda\`
      WHERE ${conditions.join(' OR ')}
      LIMIT 1
    `;

    console.log(' Query de duplicidade:', query)
    console.log(' Parâmetros da query:', JSON.stringify(queryParams, null, 2))

    const options = {
      query,
      location: 'US',
      params: queryParams,
    };

    console.log(' Executando consulta no BigQuery...')
    const [rows] = await bigqueryClient.query(options);

    console.log(' Resultado da consulta:', JSON.stringify(rows, null, 2))

    // Identificar campos duplicados
    const duplicatedFields: string[] = [];
    let hasConfirmedOrders = false;
    
    if (rows.length === 0) {
      console.log(' Usuário não encontrado no BigQuery. Permitindo avanço.')
    }
    
    if (rows.length > 0) {
      if (cpf && rows[0].cpf === cpf) duplicatedFields.push('cpf');
      if (email && rows[0].email === email) duplicatedFields.push('email');
      
      // Verificar telefone
      let rowPhone = rows[0].phone;
      if (!rowPhone && rows[0].recent_address) {
        try {
          const addressData = JSON.parse(rows[0].recent_address);
          rowPhone = addressData.first_phone || '';
        } catch (parseError) {
          console.error('Erro ao parsear recent_address:', parseError);
        }
      }
      
      if (phone && rowPhone === phone) duplicatedFields.push('phone');
      
      // Verificar se tem pedidos confirmados
      // Considera como sem pedidos confirmados se:
      // 1. confirmed_orders_count não existe 
      // 2. confirmed_orders_count é 0
      hasConfirmedOrders = rows[0].confirmed_orders_count != null && rows[0].confirmed_orders_count > 0;
      
      console.log('🛒 DETALHES DE PEDIDOS:')
      console.log('   Número de pedidos confirmados:', rows[0].confirmed_orders_count)
      console.log('   Tipo de confirmed_orders_count:', typeof rows[0].confirmed_orders_count)
      console.log('   Tem pedidos confirmados:', hasConfirmedOrders)
      console.log('   Dados completos do cliente:', JSON.stringify(rows[0], null, 2))
    }

    console.log(' Campos duplicados:', duplicatedFields)

    return {
      exists: rows.length > 0,
      duplicatedFields,
      customerData: rows.length > 0 ? rows[0] : undefined,
      hasConfirmedOrders
    };

  } catch (error) {
    console.error(' Erro COMPLETO na verificação de duplicidade no BigQuery:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : 'Sem stack trace',
      fullError: error
    })
    throw error;
  }
}
