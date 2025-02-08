export const formatCPF = (value: string) => {
  const digits = value.replace(/[^0-9]/g, "")
  let formatted = digits
  if (digits.length > 3) formatted = formatted.replace(/^(\d{3})/, "$1.")
  if (digits.length > 6) formatted = formatted.replace(/^(\d{3})\.(\d{3})/, "$1.$2.")
  if (digits.length > 9) formatted = formatted.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, "$1.$2.$3-")
  return formatted.slice(0, 14).replace(/\.$/, "") // Remove ponto no final se existir
}

export const formatCountryCode = (value: string) => {
  const hasPlus = value.startsWith('+')
  const digits = value.replace(/[^0-9]/g, "").substring(0, 3)
  const formatted = hasPlus ? "+" + digits : digits
  return formatted.startsWith('+') ? formatted : "+" + formatted
}

export const formatPhone = (value: string) => {
  return value.replace(/[^0-9]/g, "")
}
