import { debug } from '../lib/debug'

interface BrasilApiDDDResponse {
  state: string;
  cities: string[];
}

export class BrasilApiService {
  private static baseUrl = 'https://brasilapi.com.br/api'
  private static commonDDDs = {
    // São Paulo e região
    'Osasco': '11',
    'São Paulo': '11',
    'Guarulhos': '11',
    'Santo André': '11',
    'São Bernardo': '11',
    'Diadema': '11',
    'Taboão': '11',
    'Barueri': '11',
    'Santos': '13',
    'Campinas': '19',
    // Outras capitais
    'Rio': '21',
    'Belo Horizonte': '31',
    'Curitiba': '41',
    'Porto Alegre': '51',
    'Brasília': '61',
  }

  static async getDDDInfo(ddd: string): Promise<BrasilApiDDDResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/ddd/v1/${ddd}`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        debug.error('BrasilAPI', 'Erro ao buscar informações do DDD:', error)
      }
      return null
    }
  }

  static async findDDDByCity(city: string): Promise<string | null> {
    try {
      if (!city) return null

      // Normaliza o nome da cidade para comparação
      const normalizedSearchCity = city
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()

      // Primeiro tenta encontrar na lista de DDDs comuns
      for (const [cityName, ddd] of Object.entries(this.commonDDDs)) {
        const normalizedCityName = cityName
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim()

        if (normalizedSearchCity.includes(normalizedCityName) || 
            normalizedCityName.includes(normalizedSearchCity)) {
          if (process.env.NODE_ENV === 'development') {
            debug.log('BrasilAPI', 'DDD encontrado na lista:', ddd)
          }
          return ddd
        }
      }

      if (process.env.NODE_ENV === 'development') {
        debug.log('BrasilAPI', 'Buscando DDD na API para:', city)
      }
      
      // Se não encontrou, tenta alguns DDDs comuns na API
      const commonAPIDDDs = ['11', '21', '31', '41', '51', '61']
      const promises = commonAPIDDDs.map(ddd => this.getDDDInfo(ddd))
      const results = await Promise.all(promises)

      // Procura a cidade em todos os DDDs
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        if (result && result.cities) {
          const found = result.cities.some(dddCity => {
            const normalizedDDDCity = dddCity
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .trim()
            return normalizedDDDCity === normalizedSearchCity
          })

          if (found) {
            if (process.env.NODE_ENV === 'development') {
              debug.log('BrasilAPI', 'DDD encontrado na API:', commonAPIDDDs[i])
            }
            return commonAPIDDDs[i]
          }
        }
      }

      return null
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        debug.error('BrasilAPI', 'Erro ao buscar DDD pela cidade:', error)
      }
      return null
    }
  }

  // Cache para armazenar resultados e evitar requisições repetidas
  private static cityDDDCache: Map<string, string | null> = new Map()

  static async findDDDByCityWithCache(city: string): Promise<string | null> {
    if (!city) return null

    // Verifica se já temos o resultado em cache
    if (this.cityDDDCache.has(city)) {
      return this.cityDDDCache.get(city) || null
    }

    // Se não estiver em cache, busca primeiro na lista estática e depois na API
    const ddd = await this.findDDDByCity(city)
    
    // Armazena o resultado em cache
    this.cityDDDCache.set(city, ddd)
    
    return ddd
  }
}
