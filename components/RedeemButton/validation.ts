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

    // Remove todos os caracteres não numéricos
    const cleanCPF = formData.cpf.replace(/[^0-9]/g, '')
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) {
      errors.cpf = "CPF deve ter 11 dígitos"
      return errors
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      errors.cpf = "CPF inválido"
      return errors
    }

    // Validação dos dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF[i]) * (10 - i)
    }
    let digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cleanCPF[9])) {
      errors.cpf = "CPF inválido"
      return errors
    }

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF[i]) * (11 - i)
    }
    digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cleanCPF[10])) {
      errors.cpf = "CPF inválido"
      return errors
    }
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
  if (!formData.number) errors.number = language === 'pt' ? "Número é obrigatório" : "Number is required"
  if (!formData.city) errors.city = language === 'pt' ? "Cidade é obrigatória" : "City is required"
  if (!formData.state) errors.state = language === 'pt' ? "Estado é obrigatório" : "State is required"

  return errors
}
