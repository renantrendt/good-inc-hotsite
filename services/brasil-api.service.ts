interface BrasilApiDDDResponse {
  state: string;
  cities: string[];
}

export class BrasilApiService {
  private static baseUrl = 'https://brasilapi.com.br/api'

  static async getDDDInfo(ddd: string): Promise<BrasilApiDDDResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/ddd/v1/${ddd}`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar informações do DDD:', error)
      return null
    }
  }

  static async findDDDByCity(city: string): Promise<string | null> {
    try {
      // Busca todos os DDDs disponíveis (de 11 a 99)
      const ddds = Array.from({ length: 89 }, (_, i) => (i + 11).toString())
      
      // Faz as requisições em paralelo
      const promises = ddds.map(ddd => this.getDDDInfo(ddd))
      const results = await Promise.all(promises)

      // Normaliza o nome da cidade para comparação
      const normalizedSearchCity = city.normalize("NFD")
        .replace(/[\\u0300-\\u036f]/g, "")
        .toLowerCase()
        .trim()

      // Procura a cidade em todos os DDDs
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        if (result && result.cities) {
          const found = result.cities.some(dddCity => {
            const normalizedDDDCity = dddCity
              .normalize("NFD")
              .replace(/[\\u0300-\\u036f]/g, "")
              .toLowerCase()
              .trim()
            return normalizedDDDCity === normalizedSearchCity
          })

          if (found) {
            return ddds[i]
          }
        }
      }

      return null
    } catch (error) {
      console.error('Erro ao buscar DDD pela cidade:', error)
      return null
    }
  }

  // Cache para armazenar resultados e evitar requisições repetidas
  private static cityDDDCache: Map<string, string | null> = new Map()

  static async findDDDByCityWithCache(city: string): Promise<string | null> {
    // Verifica se já temos o resultado em cache
    if (this.cityDDDCache.has(city)) {
      return this.cityDDDCache.get(city) || null
    }

    // Se não estiver em cache, busca na API
    const ddd = await this.findDDDByCity(city)
    
    // Armazena o resultado em cache
    this.cityDDDCache.set(city, ddd)
    
    return ddd
  }
}
