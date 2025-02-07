interface CityAreaCode {
  city: string;
  state: string;
  code: string;
}

export const brazilAreaCodes: Record<string, CityAreaCode[]> = {
  "São Paulo": [
    { city: "São Paulo", state: "SP", code: "11" },
    { city: "Santos", state: "SP", code: "13" },
    { city: "Campinas", state: "SP", code: "19" },
  ],
  "Rio de Janeiro": [
    { city: "Rio de Janeiro", state: "RJ", code: "21" },
    { city: "Niterói", state: "RJ", code: "21" },
  ],
  "Belo Horizonte": [
    { city: "Belo Horizonte", state: "MG", code: "31" },
  ],
  "Vitória": [
    { city: "Vitória", state: "ES", code: "27" },
  ],
  "Porto Alegre": [
    { city: "Porto Alegre", state: "RS", code: "51" },
  ],
  "Curitiba": [
    { city: "Curitiba", state: "PR", code: "41" },
  ],
  "Florianópolis": [
    { city: "Florianópolis", state: "SC", code: "48" },
  ],
  "Salvador": [
    { city: "Salvador", state: "BA", code: "71" },
  ],
  "Recife": [
    { city: "Recife", state: "PE", code: "81" },
  ],
  "Fortaleza": [
    { city: "Fortaleza", state: "CE", code: "85" },
  ],
  "Manaus": [
    { city: "Manaus", state: "AM", code: "92" },
  ],
  "Brasília": [
    { city: "Brasília", state: "DF", code: "61" },
  ],
  "Goiânia": [
    { city: "Goiânia", state: "GO", code: "62" },
  ],
  "Campo Grande": [
    { city: "Campo Grande", state: "MS", code: "67" },
  ],
  "Cuiabá": [
    { city: "Cuiabá", state: "MT", code: "65" },
  ],
  "Belém": [
    { city: "Belém", state: "PA", code: "91" },
  ],
}

export function findAreaCode(city: string): string | undefined {
  // Procura exata
  const exactMatch = brazilAreaCodes[city]?.[0]?.code
  if (exactMatch) return exactMatch

  // Procura parcial (ignorando acentos e case)
  const normalizedCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  
  for (const [key, codes] of Object.entries(brazilAreaCodes)) {
    const normalizedKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    if (normalizedKey.includes(normalizedCity) || normalizedCity.includes(normalizedKey)) {
      return codes[0].code
    }
  }

  return undefined
}
