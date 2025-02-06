"use client"

import { useState, useEffect } from "react"
import { ViaCEPService } from "../services/viacep.service"
import { Lock, Unlock, Loader2 } from "lucide-react"
import { useGeolocation } from "../hooks/use-geolocation"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "./ui/dialog"
import { useLanguage } from "../contexts/LanguageContext"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import translations from "../utils/translations"
import { cn } from "../lib/utils"

interface FloatingLabelInputProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  type?: string
  required?: boolean
  disabled?: boolean
}

function FloatingLabelInput({
  id,
  name,
  value,
  onChange,
  label,
  type = "text",
  required = false,
  disabled = false,
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "block w-full h-12 px-3 pt-6 pb-2 text-sm border border-gray-300 rounded-lg transition-all duration-200 bg-white peer",
          "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
          "placeholder-transparent",
        )}
        placeholder={label}
        required={required}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-2 text-xs transition-all duration-200 pointer-events-none text-gray-500 pt-1",
          isFocused || value ? "translate-y-2 text-[10px]" : "top-1/2 -translate-y-1/2",
        )}
      >
        {label} {required && "*"}
      </label>
    </div>
  )
}

function ProgressBar({
  currentStep,
  onStepClick,
  isSubmitted,
}: { currentStep: number; onStepClick: (step: number) => void; isSubmitted?: boolean }) {
  const steps = ["Dados Pessoais", "Endereço", "Perfil"]

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="relative flex items-center justify-center flex-1">
              <div className={cn("w-full h-[2px]", index <= currentStep || isSubmitted ? "bg-black" : "bg-gray-200")} />
              <button
                onClick={() => onStepClick(index)}
                className={cn(
                  "absolute flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer",
                  isSubmitted || index < currentStep
                    ? "bg-black border-black text-white"
                    : index === currentStep
                      ? "border-black bg-white text-black"
                      : "border-gray-200 bg-white text-gray-400",
                )}
              >
                {isSubmitted || index < currentStep ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ProfileQuestion {
  id: string
  question: string
  options: { value: string; label: string }[]
}

interface FormData {
  [key: string]: string
  firstName: string
  lastName: string
  phone: string
  cpf: string
  email: string
  phoneCode: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  country: string
}

export function RedeemButton() {
  const { language } = useLanguage()
  const t = translations[language]
  const countryName = language === 'pt' ? 'Brasil' : 'United States'
  const phoneCode = language === 'pt' ? '+55' : '+1'
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})
  const [lockedFields, setLockedFields] = useState<Record<string, boolean>>({})
  const [isCEPValid, setIsCEPValid] = useState(false)
  const [isAddressLocked, setIsAddressLocked] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [personalDataErrors, setPersonalDataErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    cpf: "",
    email: "",
    phoneCode: phoneCode,
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: countryName,
  })
  const [profileAnswers, setProfileAnswers] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "cpf") {
      const digits = value.replace(/[^0-9]/g, "")
      let formatted = digits
      if (digits.length > 3) formatted = formatted.replace(/^(\d{3})/, "$1.")
      if (digits.length > 6) formatted = formatted.replace(/^(\d{3})\.(\d{3})/, "$1.$2.")
      if (digits.length > 9) formatted = formatted.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, "$1.$2.$3-")
      formatted = formatted.slice(0, 14)
      setFormData(prev => ({ ...prev, [name]: formatted }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    setPersonalDataErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleProfileChange = (id: string, value: string) => {
    setProfileAnswers((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (!formData.firstName) errors.firstName = language === 'pt' ? "Nome é obrigatório" : "First name is required"
    if (!formData.lastName) errors.lastName = language === 'pt' ? "Sobrenome é obrigatório" : "Last name is required"
    if (!formData.email) errors.email = language === 'pt' ? "Email é obrigatório" : "Email is required"
    if (!formData.phone) errors.phone = language === 'pt' ? "Telefone é obrigatório" : "Phone is required"
    if (!formData.phoneCode) errors.phoneCode = language === 'pt' ? "DDD é obrigatório" : "Country code is required"
    
    if (language === 'pt') {
      const cleanCPF = formData.cpf.replace(/\D/g, '')
      if (!formData.cpf) {
        errors.cpf = "CPF é obrigatório"
      } else if (cleanCPF.length !== 11) {
        errors.cpf = "CPF inválido"
      } else {
        let sum = 0
        for (let i = 0; i < 9; i++) {
          sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
        }
        let firstDigit = 11 - (sum % 11)
        if (firstDigit >= 10) firstDigit = 0
        if (firstDigit !== parseInt(cleanCPF.charAt(9))) {
          errors.cpf = "CPF inválido"
        } else {
          sum = 0
          for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
          }
          let secondDigit = 11 - (sum % 11)
          if (secondDigit >= 10) secondDigit = 0
          if (secondDigit !== parseInt(cleanCPF.charAt(10))) {
            errors.cpf = "CPF inválido"
          }
        }
      }
    }
    
    setPersonalDataErrors(errors)
    if (Object.keys(errors).length === 0) {
      setCurrentStep(2)
    }
  }

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (language === 'pt') {
      const formatted = ViaCEPService.formatCEP(e.target.value)
      setFormData(prev => ({
        ...prev,
        zipCode: formatted
      }))
      setAddressErrors({})

      if (formatted.length === 9) {
        if (!ViaCEPService.isValidCEP(formatted)) {
          setAddressErrors({ zipCode: "CEP inválido" })
          setIsCEPValid(false)
          return
        }

        setIsLoadingAddress(true)
        const address = await ViaCEPService.fetchAddress(formatted)
        setIsLoadingAddress(false)

        if (address) {
          setFormData(prev => ({ 
            ...prev,
            ...address,
            number: prev.number,
            country: prev.country,
            phoneCode: prev.phoneCode
          }))
          setIsCEPValid(true)
          setIsAddressLocked(true)
        } else {
          setAddressErrors({ zipCode: "CEP não encontrado" })
          setIsCEPValid(false)
        }
      } else {
        setIsCEPValid(false)
      }
    } else {
      // Para inglês, apenas atualiza o valor do campo
      setFormData(prev => ({
        ...prev,
        zipCode: e.target.value
      }))
    }
  }

  const toggleFieldLock = (field: string) => {
    setLockedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.zipCode) {
      newErrors.zipCode = language === 'pt' ? "CEP é obrigatório" : "ZIP Code is required"
    } else if (language === 'pt' && !isCEPValid) {
      newErrors.zipCode = "CEP inválido"
    }

    if (!formData.street) newErrors.street = language === 'pt' ? "Rua é obrigatória" : "Street is required"
    if (!formData.number) newErrors.number = language === 'pt' ? "Número é obrigatório" : "Number is required"

    if (!formData.city) newErrors.city = language === 'pt' ? "Cidade é obrigatória" : "City is required"
    if (!formData.state) newErrors.state = language === 'pt' ? "Estado é obrigatório" : "State is required"

    if (Object.keys(newErrors).length > 0) {
      setAddressErrors(newErrors)
      return
    }

    setCurrentStep(3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (Object.keys(profileAnswers).length !== t.redeemButton.modal.questions.length) {
      return // Prevent submission if not all questions are answered
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          phoneCode: formData.phoneCode,
          cpf: formData.cpf || null,
          address: {
            street: formData.street,
            number: formData.number,
            complement: formData.complement || null,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          },
          clothesOdor: profileAnswers.clothes_odor,
          productUnderstanding: profileAnswers.product_understanding,
          mainFocus: profileAnswers.main_focus,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      // If successful, show success message
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      // Show error message to user
    }
  }

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step + 1)
    }
  }

  const renderPersonalDataForm = () => (
    <form onSubmit={handleNextStep} className="p-3 sm:p-4 space-y-1.5 pb-28 sm:pb-32 relative">
      <div className="space-y-1.5">
        <div>
          <FloatingLabelInput
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            label={t.redeemButton.modal.form.firstName}
            required
          />
          {personalDataErrors.firstName && (
            <p className="text-xs text-red-500 mt-0.5">{personalDataErrors.firstName}</p>
          )}
        </div>
        <div>
          <FloatingLabelInput
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            label={t.redeemButton.modal.form.lastName}
            required
          />
          {personalDataErrors.lastName && (
            <p className="text-xs text-red-500 mt-0.5">{personalDataErrors.lastName}</p>
          )}
        </div>
        <div>
          <FloatingLabelInput
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            label={t.redeemButton.modal.form.email}
            type="email"
            required
          />
          {personalDataErrors.email && (
            <p className="text-xs text-red-500 mt-0.5">{personalDataErrors.email}</p>
          )}
        </div>
        <div>
          <div className="flex gap-2">
            <div className="w-20">
              <FloatingLabelInput
                id="phoneCode"
                name="phoneCode"
                value={formData.phoneCode}
                onChange={handleInputChange}
                label={language === 'pt' ? "DDD" : "Code"}
                required
              />
            </div>
            <div className="flex-1">
              <FloatingLabelInput
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                label={t.redeemButton.modal.form.phone}
                type="tel"
                required
              />
              {personalDataErrors.phone && (
                <p className="text-xs text-red-500 mt-0.5">{personalDataErrors.phone}</p>
              )}
            </div>
          </div>
        </div>
        {language === 'pt' && (
          <div>
            <FloatingLabelInput 
              id="cpf" 
              name="cpf" 
              value={formData.cpf} 
              onChange={handleInputChange} 
              label={t.redeemButton.modal.form.cpf} 
              required 
            />
            {personalDataErrors.cpf && (
              <p className="text-xs text-red-500 mt-0.5">{personalDataErrors.cpf}</p>
            )}
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          type="submit"
          className="w-full py-3 text-sm font-medium bg-black text-white rounded-lg"
        >
          {t.redeemButton.modal.form.confirmData}
        </Button>
      </div>
    </form>
  )

  const renderAddressForm = () => (
    <form onSubmit={handleAddressSubmit} className="p-3 sm:p-4 space-y-1.5 pb-24 sm:pb-24 relative">
      <div className="space-y-1.5">
        <div className="w-full">
          <div className="flex gap-1.5">
            <div className="flex-1">
              <FloatingLabelInput
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleCEPChange}
                label={language === 'pt' ? "CEP" : "ZIP Code"}
                required
              />
              {addressErrors.zipCode && (
                <p className="text-xs text-red-500 mt-0.5">{addressErrors.zipCode}</p>
              )}
            </div>
            {language === 'pt' && isLoadingAddress && (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <FloatingLabelInput
            id="street"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            label={language === 'pt' ? "Endereço" : "Street"}
            required
            disabled={false}
          />
          {addressErrors.street && (
            <p className="text-sm text-red-500 mt-1">{addressErrors.street}</p>
          )}
        </div>

        <div className="flex gap-1.5">
          <div className="flex-1">
            <FloatingLabelInput
              id="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              label={language === 'pt' ? "Número" : "Number"}
              required
            />
            {addressErrors.number && (
              <p className="text-xs text-red-500 mt-0.5">{addressErrors.number}</p>
            )}
          </div>

          <div className="flex-1">
            <FloatingLabelInput
              id="complement"
              name="complement"
              value={formData.complement}
              onChange={handleInputChange}
              label={language === 'pt' ? "Complemento" : "Complement"}
            />
          </div>
        </div>

        <div className="w-full">
          <FloatingLabelInput
            id="neighborhood"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleInputChange}
            label={language === 'pt' ? "Bairro" : "Neighborhood"}
            disabled={false}
          />
          {addressErrors.neighborhood && (
            <p className="text-sm text-red-500 mt-1">{addressErrors.neighborhood}</p>
          )}
        </div>

        <div className="w-full">
          <FloatingLabelInput
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            label={language === 'pt' ? "Cidade" : "City"}
            required
            disabled={false}
          />
          {addressErrors.city && (
            <p className="text-sm text-red-500 mt-1">{addressErrors.city}</p>
          )}
        </div>

        <div className="w-full">
          <FloatingLabelInput
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            label={language === 'pt' ? "Estado" : "State"}
            required
            disabled={false}
          />
          {addressErrors.state && (
            <p className="text-sm text-red-500 mt-1">{addressErrors.state}</p>
          )}
        </div>

        <div className="w-full">
          <FloatingLabelInput
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            label={language === 'pt' ? "País" : "Country"}
            required
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          type="submit"
          className="w-full py-3 text-sm font-medium bg-black text-white rounded-lg"
        >
          {language === 'pt' ? "Próximo" : "Next"}
        </Button>
      </div>
    </form>
  )

  const renderProfileForm = () => (
    <form onSubmit={handleSubmit} className="p-3 sm:p-4 pb-16 relative">
      <div className="space-y-4 mb-12 sm:mb-24">
        {t.redeemButton.modal.questions.map((q) => (
          <div key={q.id} className="space-y-4">
            <p className="text-sm font-medium">{q.question}</p>
            <RadioGroup
              onValueChange={(value) => handleProfileChange(q.id, value)}
              value={profileAnswers[q.id]}
              className="grid grid-cols-2 gap-0 w-full"
              required
            >
              {q.options.map((option, index) => (
                <div key={option.value}>
                  <Label
                    htmlFor={`${q.id}-${option.value}`}
                    className="relative block w-full cursor-pointer"
                  >
                    <RadioGroupItem value={option.value} id={`${q.id}-${option.value}`} className="absolute opacity-0" />
                    <div className={cn(
                      "flex flex-col items-center justify-center w-full p-3 text-sm border border-gray-200 min-h-[40px] transition-all duration-200 whitespace-nowrap",
                      index % 2 === 0 ? "rounded-l-lg" : "rounded-r-lg",
                      profileAnswers[q.id] === option.value ? "bg-black text-white border-black" : "bg-white text-gray-500 hover:bg-gray-50"
                    )}>
                      {option.label}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          type="submit"
          className="w-full py-3 text-sm font-medium bg-black text-white rounded-lg"
          disabled={Object.keys(profileAnswers).length !== t.redeemButton.modal.questions.length}
        >
          {t.redeemButton.modal.form.finishOrder}
        </Button>
      </div>
    </form>
  )

  const renderSuccessMessage = () => (
    <div className="p-6 text-center space-y-4">
      <p className="text-gray-600 mb-8">
        {t.redeemButton.modal.success.message}
      </p>
      <Button
        onClick={() => setIsOpen(false)}
        className="w-full p-4 text-lg font-medium bg-black text-white rounded-lg"
      >
        {t.redeemButton.modal.success.close}
      </Button>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <DialogTrigger asChild>
        <div className="flex flex-col items-center">
          <Button className="w-full sm:w-auto px-4 py-2 bg-black text-white text-sm font-medium whitespace-nowrap rounded-md uppercase">
            {t.redeemButton.text || 'RESGATAR'}
          </Button>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">{t.redeemButton.price}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 bg-white max-h-[85vh] flex flex-col fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-lg z-50 w-[90vw] sm:w-full">
        <div className="overflow-y-auto flex-grow">
          <DialogHeader className="p-4">
            <DialogTitle className="text-xl font-bold mb-4 text-center">
              {isSubmitted ? t.redeemButton.modal.titles.thanks : 
               currentStep === 1 ? t.redeemButton.modal.titles.personalData : 
               currentStep === 2 ? "Endereço de Entrega" :
               t.redeemButton.modal.titles.profile
              }
            </DialogTitle>
            <ProgressBar currentStep={currentStep - 1} onStepClick={handleStepClick} isSubmitted={isSubmitted} />
          </DialogHeader>
          {isSubmitted ? renderSuccessMessage() : (
            currentStep === 1 ? renderPersonalDataForm() :
            currentStep === 2 ? renderAddressForm() :
            renderProfileForm()
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

