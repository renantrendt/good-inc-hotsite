"use client"

import { useState, useEffect } from "react"
import { ViaCEPService } from "../../services/viacep.service"
import { useLanguage } from "../../contexts/LanguageContext"
import translations from "../../utils/translations"
import { BrasilApiService } from "../../services/brasil-api.service"
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { FormData } from "./types"
import { debug } from "../../lib/debug"
import { validatePersonalData, validateAddress } from "./validation"
import { formatCPF, formatCountryCode, formatPhone } from "./utils"
import { ProgressBar } from "./ProgressBar"
import { PersonalDataForm } from "./PersonalDataForm"
import { AddressForm } from "./AddressForm"
import { ProfileForm } from "./ProfileForm"
import { SuccessMessage } from "./SuccessMessage"
import { ExistingCustomerMessage } from "./ExistingCustomerMessage"

export function RedeemButton() {
  const [isClient, setIsClient] = useState(false)
  const { language, geoData, isLoading: isLanguageLoading } = useLanguage()
  const t = translations[language]
  
  const [countryName, setCountryName] = useState('')
  const [phoneCode, setPhoneCode] = useState('')

  useEffect(() => {
    setIsClient(true)
    setCountryName(language === 'pt' ? 'Brasil' : 'United States')
    setPhoneCode(language === 'pt' ? '+55' : '+1')
  }, [language])

  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})
  const [isCEPValid, setIsCEPValid] = useState(false)
  const [isAddressLocked, setIsAddressLocked] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isExistingCustomer, setIsExistingCustomer] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalDataErrors, setPersonalDataErrors] = useState<Record<string, string>>({})
  const [isCPFValid, setIsCPFValid] = useState(false)
  const [isValidatingCPF, setIsValidatingCPF] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    cpf: "",
    email: "",
    countryCode: language === 'pt' ? '+55' : '+1',
    cityCode: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: language === 'pt' ? 'Brasil' : 'United States',
    clothesOdor: "",
    productUnderstanding: "",
    mainFocus: "",
    referral: ""
  })

  useEffect(() => {
    async function fetchDDD() {
      if (language === 'pt' && geoData?.country_code === 'BR' && geoData?.city) {
        debug.log('DDD', 'Buscando DDD para cidade:', geoData.city)
        const ddd = await BrasilApiService.findDDDByCityWithCache(geoData.city)
        debug.log('DDD', 'DDD encontrado:', ddd)
        if (ddd) {
          setFormData(prev => ({
            ...prev,
            cityCode: ddd
          }))
        }
      }
    }
    fetchDDD()
  }, [language, geoData])

  const validateCPF = async (cpf: string, nome: string) => {
    setIsValidatingCPF(true)
    try {
      const response = await fetch(`${window.location.origin}/api/validate-cpf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, nome })
      })

      const result = await response.json()
      
      if (!result.valid) {
        setPersonalDataErrors(prev => ({
          ...prev,
          cpf: result.message
        }))
        setIsCPFValid(false)
      } else {
        setPersonalDataErrors(prev => ({ ...prev, cpf: "" }))
        setIsCPFValid(true)
        
        // Verifica se todos os campos estão válidos antes de avançar
        const errors = validatePersonalData(formData, language, t)
        if (Object.keys(errors).length === 0) {
          setCurrentStep(2)
        } else {
          setPersonalDataErrors(errors)
        }
      }
    } catch (error) {
      console.error('Erro ao validar CPF:', error)
      setPersonalDataErrors(prev => ({
        ...prev,
        cpf: "Erro ao validar CPF. Tente novamente."
      }))
      setIsCPFValid(false)
    } finally {
      setIsValidatingCPF(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === "cpf") {
      const formattedCPF = formatCPF(value)
      setFormData(prev => ({ ...prev, [name]: formattedCPF }))
      
      // Se o CPF tem 14 caracteres (formato XXX.XXX.XXX-XX), valida
      if (formattedCPF.length === 14) {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim()
        validateCPF(formattedCPF, fullName)
      }
    } else if (name === "countryCode") {
      setFormData(prev => ({ ...prev, [name]: formatCountryCode(value) }))
    } else if (name === "phone") {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }))
      setPersonalDataErrors(prev => ({ ...prev, phone: "" }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    setPersonalDataErrors(prev => ({ ...prev, [name]: "" }))
  }

  
  const handleProfileChange = (id: string, value: string) => {
    const fieldMapping: Record<string, string> = {
      'clothes_odor': 'clothesOdor',
      'product_understanding': 'productUnderstanding',
      'main_focus': 'mainFocus',
      'referral': 'referral'
    }

    if (fieldMapping[id]) {
      setFormData(prev => ({
        ...prev,
        [fieldMapping[id]]: value
      }))
    }
  }

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validatePersonalData(formData, language, t)
    setPersonalDataErrors(errors)
    
    // Se tiver erros básicos de validação, não prossegue
    if (Object.keys(errors).length > 0) {
      return
    }
    
    // Se estiver em português, valida o CPF com o nome atual
    if (language === 'pt' && formData.cpf) {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      await validateCPF(formData.cpf, fullName)
      
      // Se o CPF não for válido, não prossegue
      if (!isCPFValid) {
        return
      }
    }
    
    setCurrentStep(2)
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
            country: prev.country
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
      setFormData(prev => ({
        ...prev,
        zipCode: e.target.value
      }))
    }
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateAddress(formData, language, isCEPValid)
    setAddressErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(3)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verifica se todos os campos obrigatórios do perfil estão preenchidos
    if (
      !formData.clothesOdor ||
      !formData.productUnderstanding ||
      !formData.mainFocus ||
      !formData.referral ||
      formData.referral.length <= 3
    ) {
      return
    }

    setIsSubmitting(true)
    try {
      // Log dos dados antes de enviar
      debug.log('Form', 'Form Data:', formData)

      try {
        const apiUrl = '/api/leads'
        debug.log('Form', 'Sending request to:', apiUrl)

        // Verificação de duplicidade no BigQuery
        let bigQueryCheckResponse;
        try {
          bigQueryCheckResponse = await fetch('/api/check-customer-duplicity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cpf: formData.cpf,
              email: formData.email,
              phone: formData.phone
            })
          })
        } catch (fetchError) {
          debug.error('Form', 'Erro na requisição de duplicidade:', fetchError)
          // Se falhar na requisição, mostra erro detalhado
          alert(`Erro ao verificar duplicidade: ${fetchError instanceof Error ? fetchError.message : 'Erro desconhecido'}`)
          setIsSubmitting(false)
          return
        }

        let bigQueryCheck;
        try {
          // Verifica se a resposta é ok antes de tentar parsear
          if (!bigQueryCheckResponse.ok) {
            const errorText = await bigQueryCheckResponse.text()
            debug.error('Form', `Erro na verificação de duplicidade. Status: ${bigQueryCheckResponse.status}`, errorText)
            
            // Mostra mensagem de erro para o usuário
            alert(`Erro na verificação de duplicidade: ${errorText || 'Erro interno do servidor'}`)
            
            setIsSubmitting(false)
            return
          }

          bigQueryCheck = await bigQueryCheckResponse.json()
        } catch (parseError) {
          debug.error('Form', 'Erro ao parsear resposta do BigQuery:', parseError)
          
          // Mostra mensagem de erro para o usuário
          alert(`Erro ao processar verificação de duplicidade: ${parseError instanceof Error ? parseError.message : 'Erro desconhecido'}`)
          
          // Continua o fluxo em caso de erro de parsing
          bigQueryCheck = { exists: false, duplicatedFields: [] }
        }

        // Se houver duplicidade no BigQuery, verifica pedidos confirmados
        if (bigQueryCheck.exists && bigQueryCheck.hasConfirmedOrders) {
          debug.log('Form', 'Cliente com pedidos confirmados, bloqueando submissão')
          setIsExistingCustomer(true)
          setIsOpen(true)  // Mantém o modal aberto
          return
        }

        // Adiciona um delay de 1 segundo antes de chamar a API
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Se não tiver pedidos confirmados, continua o fluxo normal
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': language
          },
          body: JSON.stringify(formData)
        })

        const result = await response.json()
        debug.log('Form', 'API Response:', result)

        if (!response.ok) {
          if (result.error === 'Existing customer' || result.error === 'Duplicate lead found') {
            setIsExistingCustomer(true)
            setIsOpen(true)  // Mantém o modal aberto
            return
          }
          throw new Error(result.error || 'Error submitting form')
        }

        // Se chegou aqui, significa que deu tudo certo
        setIsSubmitted(true)
      } catch (error: any) {
        debug.error('[Form] Error submitting form:', error)
        
        // Tratamento de erros genéricos
        if (!isExistingCustomer) { // Só mostra o alerta se não for cliente existente
          alert(`Erro ao submeter formulário: ${error.message || 'Ocorreu um erro ao enviar o formulário.'}`)
        }
      } finally {
        setIsSubmitting(false)
      }
    } catch (error) {
      debug.error('Form', 'Error submitting form:', error)
      debug.error('Form', 'Form Data:', formData)
      
      // Mostra mensagem de erro para o usuário
      alert(`Erro ao submeter formulário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step + 1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <DialogTrigger asChild>
        <div className="flex flex-col items-center gap-0.5">
          <div className="text-xs sm:text-sm text-gray-600 font-bold">{t.redeemButton.price}</div>
          <Button className="w-full sm:w-auto px-4 py-1.5 bg-black text-white text-sm font-medium whitespace-nowrap rounded-md uppercase">
            {t.redeemButton.text || 'RESGATAR'}
          </Button>
          <div className="text-xs sm:text-sm text-gray-600">
            {t.redeemButton.noCard}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 bg-white max-h-[85vh] flex flex-col fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-lg z-50 w-[90vw] sm:w-full">
        <div className="overflow-y-auto flex-grow">
          <DialogHeader className="p-4">
            <DialogTitle className="text-xl font-bold mb-4 text-center">
              {isSubmitted ? t.redeemButton.modal.titles.thanks : 
               currentStep === 1 ? t.redeemButton.modal.titles.personalData : 
               currentStep === 2 ? t.redeemButton.modal.titles.shippingAddress :
               t.redeemButton.modal.titles.profile
              }
            </DialogTitle>
            <ProgressBar currentStep={currentStep - 1} onStepClick={handleStepClick} isSubmitted={isSubmitted} />
          </DialogHeader>
          {isSubmitted ? (
            <SuccessMessage onClose={() => setIsOpen(false)} t={t} />
          ) : isExistingCustomer ? (
            <ExistingCustomerMessage t={t} />
          ) : currentStep === 1 ? (
            <PersonalDataForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleNextStep={handleNextStep}
              personalDataErrors={personalDataErrors}
              language={language}
              t={t}
              isValidatingCPF={isValidatingCPF}
            />
          ) : currentStep === 2 ? (
            <AddressForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleCEPChange={handleCEPChange}
              handleAddressSubmit={handleAddressSubmit}
              addressErrors={addressErrors}
              isLoadingAddress={isLoadingAddress}
              language={language}
              t={t}
            />
          ) : (
            <ProfileForm
              handleSubmit={handleSubmit}
              handleProfileChange={handleProfileChange}
              formData={formData}
              isSubmitting={isSubmitting}
              t={t}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
