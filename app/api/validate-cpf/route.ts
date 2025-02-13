import { NextResponse } from 'next/server';

const SERPRO_CONSUMER_KEY = process.env.SERPRO_CONSUMER_KEY;
const SERPRO_CONSUMER_SECRET = process.env.SERPRO_CONSUMER_SECRET;

if (!SERPRO_CONSUMER_KEY || !SERPRO_CONSUMER_SECRET) {
  throw new Error('Credenciais da API SERPRO não configuradas. Configure SERPRO_CONSUMER_KEY e SERPRO_CONSUMER_SECRET no arquivo .env');
}
const SERPRO_API_URL = 'https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v1/cpf';
const SERPRO_TOKEN_URL = 'https://gateway.apiserpro.serpro.gov.br/token';

interface CPFResponse {
  ni: string;
  nome: string;
  situacao: {
    codigo: string;
    descricao: string;
  };
  nascimento: string;
}

// Função para obter token de acesso
async function getAccessToken() {
  const basicAuth = Buffer.from(`${SERPRO_CONSUMER_KEY}:${SERPRO_CONSUMER_SECRET}`).toString('base64');
  const tokenResponse = await fetch(SERPRO_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!tokenResponse.ok) {
    console.error('Erro ao obter token SERPRO:', await tokenResponse.text());
    throw new Error('Erro ao autenticar com SERPRO');
  }

  const { access_token } = await tokenResponse.json();
  return access_token;
}

// Função para consultar CPF
async function consultarCPF(cpf: string, token: string) {
  const response = await fetch(`${SERPRO_API_URL}/${cpf}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  return response;
}

export async function POST(request: Request) {
  try {
    const { cpf, nome } = await request.json();

    console.log('Dados recebidos:', { cpf, nome });

    if (!cpf || !nome) {
      return NextResponse.json({ error: 'CPF e nome são obrigatórios' }, { status: 400 });
    }

    // Remove caracteres especiais do CPF
    const cleanCPF = cpf.replace(/[^\d]/g, '');

    // Primeira tentativa
    let access_token = await getAccessToken();
    let response = await consultarCPF(cleanCPF, access_token);

    // Se receber 401 (Unauthorized), o token expirou. Tenta novamente com novo token
    if (response.status === 401) {
      console.log('Token expirado, obtendo novo token...');
      access_token = await getAccessToken();
      response = await consultarCPF(cleanCPF, access_token);
    }

    if (response.status === 404 || response.status === 400) {
      return NextResponse.json({
        valid: false,
        message: 'CPF não encontrado',
        data: {
          situacao: 'Não encontrado'
        }
      }, { status: 404 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: 'Erro ao validar CPF' }, { status: response.status });
    }

    const data = await response.json() as CPFResponse;
    
    // Verifica a situação do CPF
    if (data.situacao.codigo !== "0") {
      let situacaoMessage = '';
      
      switch (data.situacao.descricao) {
        case 'Pendente de Regularização':
          situacaoMessage = 'CPF está pendente de regularização';
          break;
        case 'Cancelada por Multiplicidade':
          situacaoMessage = 'CPF foi cancelado por multiplicidade';
          break;
        case 'Nula':
          situacaoMessage = 'CPF está nulo';
          break;
        case 'Cancelada de Ofício':
          situacaoMessage = 'CPF foi cancelado de ofício';
          break;
        case 'Titular Falecido':
          situacaoMessage = 'CPF pertence a pessoa falecida';
          break;
        default:
          situacaoMessage = `CPF irregular: ${data.situacao.descricao}`;
      }

      return NextResponse.json({
        valid: false,
        message: situacaoMessage,
        data: {
          situacao: data.situacao.descricao
        }
      });
    }

    // Divide os nomes em partes e normaliza (remove acentos)
    const normalizeText = (text: string) => {
      return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    };

    console.log('Nome bruto do SERPRO:', data.nome);
    console.log('Nome bruto fornecido:', nome);

    // Primeiro divide os nomes e remove espaços vazios
    const serproNameParts = data.nome.split(' ');
    const providedNameParts = nome.split(' ');

    console.log('Após split:', {
      serpro: serproNameParts,
      provided: providedNameParts
    });

    const serproNames = serproNameParts.filter((n: string) => n.trim() !== '').map(normalizeText);
    const providedNames = providedNameParts.filter((n: string) => n.trim() !== '').map(normalizeText);

    console.log('Após filtro e normalização:', {
      serpro: serproNames,
      provided: providedNames
    });
    
    // Pega o primeiro nome
    const serproFirstName = serproNames[0];
    const providedFirstName = providedNames[0];
    
    // Verifica se o primeiro nome corresponde
    const firstNameMatch = serproFirstName === providedFirstName;

    console.log('Primeiro nome:', {
      serpro: serproFirstName,
      provided: providedFirstName,
      match: firstNameMatch
    });
    
    // Pega os sobrenomes fornecidos (tudo após o primeiro nome)
    const providedLastNames = providedNames.slice(1);
    
    // Verifica se pelo menos um dos sobrenomes fornecidos está presente no nome do SERPRO
    // e não é igual ao primeiro nome
    const lastNameMatch = providedLastNames.length > 0 && providedLastNames.some((lastName: string) => 
      lastName !== providedFirstName && // não pode ser igual ao primeiro nome
      serproNames.slice(1).includes(lastName) // procura apenas nos sobrenomes do SERPRO
    );

    console.log('Sobrenomes:', {
      serproNames,
      providedLastNames,
      match: lastNameMatch
    });

    // Determina a mensagem baseada nas correspondências
    let message = '';
    if (!firstNameMatch) {
      message = 'Primeiro nome não corresponde ao CPF';
    } else if (!lastNameMatch) {
      message = 'Sobrenome não corresponde ao CPF';
    } else {
      message = 'Nome corresponde ao CPF';
    }

    return NextResponse.json({
      valid: firstNameMatch && lastNameMatch,
      message,
      data: {
        situacao: data.situacao.descricao
      }
    });

  } catch (error) {
    console.error('Erro ao validar CPF:', error);
    return NextResponse.json({ error: 'Erro interno ao validar CPF' }, { status: 500 });
  }
}
