import { FormData } from './types'

export const validatePersonalData = (formData: FormData, language: 'en' | 'pt', t: any) => {
  const errors: Record<string, string> = {}

  if (!formData.firstName) errors.firstName = language === 'pt' ? "Nome é obrigatório" : "First name is required"
  if (!formData.lastName) errors.lastName = language === 'pt' ? "Sobrenome é obrigatório" : "Last name is required"
  if (!formData.email) errors.email = language === 'pt' ? "Email é obrigatório" : "Email is required"
  
  if (!formData.phone) {
    errors.phone = language === 'pt' ? "Celular é obrigatório" : "Phone is required"
  } else if (language === 'pt') {
    if (formData.phone.length !== 9) {
      errors.phone = t.redeemButton.errors.phoneLength
    } else if (!formData.phone.startsWith('9')) {
      errors.phone = t.redeemButton.errors.phoneStartWith9
    }
  }

  if (language === 'pt') {
    if (!formData.countryCode) {
      errors.countryCode = "País é obrigatório"
    } else if (!formData.countryCode.startsWith('+')) {
      errors.countryCode = "País deve começar com +"
    }

    if (!formData.cityCode) {
      errors.cityCode = "DDD é obrigatório"
    } else if (formData.cityCode.length !== 2) {
      errors.cityCode = "DDD deve ter 2 dígitos"
    }

    if (!formData.cpf) {
      errors.cpf = "CPF é obrigatório"
      return errors
    }

    // A validação completa do CPF agora é feita via API
    // Aqui só verificamos se foi preenchido
  } else {
    if (!formData.countryCode) {
      errors.countryCode = "Country code is required"
    } else if (!formData.countryCode.startsWith('+')) {
      errors.countryCode = "Country code must start with +"
    }
  }

  return errors
}

export const validateAddress = (formData: FormData, language: 'en' | 'pt', isCEPValid: boolean) => {
  const errors: Record<string, string> = {}

  if (!formData.zipCode) {
    errors.zipCode = language === 'pt' ? "CEP é obrigatório" : "ZIP Code is required"
  } else if (language === 'pt' && !isCEPValid) {
    errors.zipCode = "CEP inválido"
  }

  if (!formData.street) errors.street = language === 'pt' ? "Rua é obrigatória" : "Street is required"
  if (language === 'pt' && !formData.number) errors.number = "Número é obrigatório"
  if (!formData.city) errors.city = language === 'pt' ? "Cidade é obrigatória" : "City is required"
  if (!formData.state) errors.state = language === 'pt' ? "Estado é obrigatório" : "State is required"

  return errors
}
