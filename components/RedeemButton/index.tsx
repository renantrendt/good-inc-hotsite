"use client"

import { useState, useEffect } from "react"
import { ViaCEPService } from "../../services/viacep.service"
import { useLanguage } from "../../contexts/LanguageContext"
import translations from "../../utils/translations"
import { findAreaCode } from "../../utils/brazil-area-codes"
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { FormData } from "./types"
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
  const [profileAnswers, setProfileAnswers] = useState<Record<string, string>>({})

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
    mainFocus: ""
  })

  useEffect(() => {
    if (language === 'pt' && geoData?.country_code === 'BR' && geoData?.city) {
      const areaCode = findAreaCode(geoData.city)
      if (areaCode) {
        setFormData(prev => ({
          ...prev,
          cityCode: prev.cityCode || areaCode
        }))
      }
    }
  }, [language, geoData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "cpf") {
      setFormData(prev => ({ ...prev, [name]: formatCPF(value) }))
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
    setProfileAnswers((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validatePersonalData(formData, language, t)
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
    
    if (Object.keys(profileAnswers).length !== t.redeemButton.modal.questions.length) {
      return
    }

    setIsSubmitting(true)
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
          countryCode: formData.countryCode,
          cityCode: formData.cityCode || null,
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
        const errorData = await response.json()
        if (response.status === 400 && errorData.duplicatedFields) {
          // Mostrar mensagem de cliente existente
          setIsExistingCustomer(true)
          return
        }
        throw new Error('Failed to submit form')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
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
              profileAnswers={profileAnswers}
              isSubmitting={isSubmitting}
              t={t}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
