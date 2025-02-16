/**
 * Normaliza o CPF removendo caracteres não numéricos
 * @param cpf CPF a ser normalizado
 * @returns CPF contendo apenas números
 */
export function normalizeCPF(cpf: string | null | undefined): string | undefined {
  if (!cpf) return undefined
  
  // Remove todos os caracteres que não são números
  const cleanedCPF = cpf.replace(/\D/g, '')
  
  return cleanedCPF
}

/**
 * Valida se o CPF é válido
 * @param cpf CPF a ser validado
 * @returns Booleano indicando validade do CPF
 */
export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = normalizeCPF(cpf)
  
  if (!cleanCPF) return false
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false
  
  // Cálculo dos dígitos verificadores
  let sum = 0
  let remainder
  
  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i-1, i)) * (11 - i)
  }
  
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false
  
  // Segundo dígito verificador
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i-1, i)) * (12 - i)
  }
  
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  
  return remainder === parseInt(cleanCPF.substring(10, 11))
}

/**
 * Formata o CPF com pontos e traço
 * @param cpf CPF a ser formatado
 * @returns CPF formatado (xxx.xxx.xxx-xx)
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = normalizeCPF(cpf)
  
  if (!cleanCPF || cleanCPF.length !== 11) return cpf
  
  return cleanCPF.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4'
  )
}
