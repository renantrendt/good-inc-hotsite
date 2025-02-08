import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { debug } from '../../../lib/debug';

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

// Mapa de IPs locais conhecidos
const LOCAL_IPS = [
  '127.0.0.1',
  '::1',
  '::ffff:127.0.0.1',
  'localhost',
];

// Regex para IPs privados
const PRIVATE_IP_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^fc00:/,
  /^fe80:/
];

// Verifica se é um IP local ou privado
function isLocalOrPrivateIP(ip: string): boolean {
  if (LOCAL_IPS.includes(ip)) return true;
  
  // Remove IPv6 mapping se presente
  const cleanIP = ip.replace(/^::ffff:/, '');
  
  return PRIVATE_IP_RANGES.some(range => range.test(cleanIP));
}

// Delay entre chamadas de API para evitar rate limit
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getLocationFromIP(ip: string) {
  debug.log('Geolocation', 'Iniciando detecção de localização para IP:', ip);

  // Tentar primeiro o ipapi.co
  try {
    debug.log('Geolocation', 'Tentando ipapi.co...');
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    debug.log('Geolocation', 'Status ipapi.co:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      debug.log('Geolocation', 'Resposta ipapi.co:', data);
      
      if (data.error) {
        debug.log('Geolocation', 'ipapi.co retornou erro:', data.error);
        throw new Error('IP API returned error');
      }
      return data;
    }

    // Se receber 429 (rate limit), esperar antes de tentar próxima API
    if (response.status === 429) {
      debug.log('Geolocation', 'Rate limit atingido, aguardando...');
      await delay(1000);
    }
  } catch (error) {
    debug.error('Geolocation', 'ipapi.co falhou:', error);
  }

  // Fallback para o ip-api.com
  try {
    debug.log('Geolocation', 'Tentando ip-api.com...');
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    debug.log('Geolocation', 'Status ip-api.com:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      debug.log('Geolocation', 'Resposta ip-api.com:', data);
      
      if (data.status === 'fail') {
        throw new Error(`ip-api.com failed: ${data.message}`);
      }

      return {
        country_code: data.countryCode,
        country_name: data.country,
        city: data.city,
        region: data.regionName
      };
    }
  } catch (error) {
    debug.error('Geolocation', 'ip-api.com falhou:', error);
  }

  throw new Error('All geolocation services failed');
}

export async function GET() {
  debug.log('Geolocation', 'Iniciando requisição GET');
  
  try {
    const headersList = headers();
    debug.log('Geolocation', 'Headers recebidos:', {
      'x-forwarded-for': headersList.get('x-forwarded-for'),
      'x-real-ip': headersList.get('x-real-ip')
    });

    // Tentar obter IP real considerando proxies
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               '127.0.0.1';

    debug.log('Geolocation', 'IP detectado:', ip);
    
    // Verificar se é IP local ou privado
    if (isLocalOrPrivateIP(ip)) {
      debug.log('Geolocation', 'IP local/privado detectado, simulando localização BR');
      return NextResponse.json({
        country_code: 'BR',
        country_name: 'Brazil',
        city: 'São Paulo',
        region: 'São Paulo'
      });
    }

    const data = await getLocationFromIP(ip);

    const locationData = {
      country_code: data.country_code,
      country_name: data.country_name,
      city: data.city,
      region: data.region
    };

    debug.log('Geolocation', 'Localização detectada com sucesso:', locationData);
    return NextResponse.json(locationData);
  } catch (error) {
    debug.error('Geolocation', 'Erro ao detectar localização:', error);
    // Em caso de erro, retornar um país neutro para não quebrar a aplicação
    return NextResponse.json({
      country_code: 'US',
      country_name: 'United States',
      city: 'Unknown',
      region: 'Unknown'
    });
  }
}
