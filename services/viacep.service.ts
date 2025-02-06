interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export class ViaCEPService {
  static isValidCEP(cep: string): boolean {
    const cleanCEP = cep.replace(/\D/g, '')
    return cleanCEP.length === 8 && /^[0-9]{8}$/.test(cleanCEP)
  }

  static async fetchAddress(cep: string): Promise<AddressData | null> {
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      
      if (cleanCEP.length !== 8) {
        throw new Error('CEP inválido');
      }

      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      return {
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        zipCode: data.cep
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    }
  }

  static formatCEP(value: string): string {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
  }
}
