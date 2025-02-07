export interface FormData {
  firstName: string
  lastName: string
  phone: string
  cpf: string
  email: string
  countryCode: string
  cityCode: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  country: string
  clothesOdor: string
  productUnderstanding: string
  mainFocus: string
}

export interface ProfileQuestion {
  id: string
  question: string
  options: { value: string; label: string }[]
}

export interface FloatingLabelInputProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  type?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  language?: 'en' | 'pt'
}
