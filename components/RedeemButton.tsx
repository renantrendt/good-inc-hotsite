"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "../contexts/LanguageContext"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import translations from "../utils/translations"
import { cn } from "@/lib/utils"

interface FloatingLabelInputProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  type?: string
  required?: boolean
}

function FloatingLabelInput({
  id,
  name,
  value,
  onChange,
  label,
  type = "text",
  required = false,
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
          "block w-full h-16 px-4 pt-5 text-lg border border-gray-300 rounded-lg transition-all duration-200 bg-white peer",
          "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
          "placeholder-transparent",
        )}
        placeholder={label}
        required={required}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-4 transition-all duration-200 pointer-events-none text-gray-500",
          isFocused || value ? "transform -translate-y-3 scale-75 origin-left" : "top-1/2 -translate-y-1/2",
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
  titles
}: { 
  currentStep: number; 
  onStepClick: (step: number) => void; 
  isSubmitted?: boolean;
  titles: {
    personalData: string;
    shippingAddress: string;
    profile: string;
  };
}) {
  const steps = [titles.personalData, titles.shippingAddress, titles.profile]

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
}

export function RedeemButton() {
  const { language } = useLanguage()
  const t = translations[language]
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: language === 'pt' ? '+55' : '+1',
    cpf: "",
    email: "",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: ""
    }
  })
  const [profileAnswers, setProfileAnswers] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleProfileChange = (id: string, value: string) => {
    setProfileAnswers((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    // Verifica se todos os campos obrigatórios estão preenchidos
    const requiredFields = ['firstName', 'lastName', 'email', 'phone']
    if (language === 'pt') {
      requiredFields.push('cpf')
    }
    
    const isValid = requiredFields.every(field => formData[field])
    if (isValid) {
      if (currentStep === 1) {
        setCurrentStep(2)
      } else if (currentStep === 2) {
        const addressFields = ['street', 'number', 'city', 'state', 'zipCode']
        const isAddressValid = addressFields.every(field => formData.address[field])
        if (isAddressValid) {
          setCurrentStep(3)
        }
      }
    }
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
          cpf: formData.cpf || null,
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
    <form onSubmit={handleNextStep} className="p-4 sm:p-6 space-y-4 pb-28 sm:pb-32 relative">
      <FloatingLabelInput
        id="firstName"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        label={t.redeemButton.modal.form.firstName}
        required
      />
      <FloatingLabelInput
        id="lastName"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        label={t.redeemButton.modal.form.lastName}
        required
      />
      <FloatingLabelInput
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        label={t.redeemButton.modal.form.email}
        type="email"
        required
      />
      <div className="flex gap-2">
        <div className="w-1/4">
          <select
            value={formData.countryCode}
            onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
            className="block w-full h-16 px-4 pt-5 text-lg border border-gray-300 rounded-lg transition-all duration-200 bg-white"
            aria-label={t.countrySelector.label}
          >
            <option value="+55">+55</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
            <option value="+33">+33</option>
            <option value="+49">+49</option>
            <option value="+81">+81</option>
            <option value="+86">+86</option>
          </select>
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
        </div>
      </div>
      {language === 'pt' && (
        <FloatingLabelInput id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} label={t.redeemButton.modal.form.cpf} required />
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          type="submit"
          className="w-full p-4 text-lg font-medium bg-black text-white rounded-lg"
        >
          {t.redeemButton.modal.form.confirmData}
        </Button>
      </div>
    </form>
  )

  const renderAddressForm = () => (
    <form onSubmit={handleNextStep} className="p-4 sm:p-6 space-y-4 pb-28 sm:pb-32 relative">
      <FloatingLabelInput
        id="street"
        name="address.street"
        value={formData.address.street}
        onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
        label={t.redeemButton.modal.form.street}
        required
      />
      <div className="flex gap-4">
        <div className="w-1/3">
          <FloatingLabelInput
            id="number"
            name="address.number"
            value={formData.address.number}
            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, number: e.target.value } }))}
            label={t.redeemButton.modal.form.number}
            required
          />
        </div>
        <div className="flex-1">
          <FloatingLabelInput
            id="complement"
            name="address.complement"
            value={formData.address.complement}
            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, complement: e.target.value } }))}
            label={t.redeemButton.modal.form.complement}
          />
        </div>
      </div>
      <FloatingLabelInput
        id="neighborhood"
        name="address.neighborhood"
        value={formData.address.neighborhood}
        onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, neighborhood: e.target.value } }))}
        label={t.redeemButton.modal.form.neighborhood}
      />
      <div className="flex gap-4">
        <div className="flex-1">
          <FloatingLabelInput
            id="city"
            name="address.city"
            value={formData.address.city}
            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
            label={t.redeemButton.modal.form.city}
            required
          />
        </div>
        <div className="w-1/3">
          <FloatingLabelInput
            id="state"
            name="address.state"
            value={formData.address.state}
            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))}
            label={t.redeemButton.modal.form.state}
            required
          />
        </div>
      </div>
      <FloatingLabelInput
        id="zipCode"
        name="address.zipCode"
        value={formData.address.zipCode}
        onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, zipCode: e.target.value } }))}
        label={t.redeemButton.modal.form.zipCode}
        required
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          type="submit"
          className="w-full p-4 text-lg font-medium bg-black text-white rounded-lg"
        >
          {t.redeemButton.modal.form.confirmData}
        </Button>
      </div>
    </form>
  )

  const renderProfileForm = () => (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 pb-16  relative">
      <div className="space-y-8 mb-12 sm:mb-24">
        {t.redeemButton.modal.questions.map((q) => (
          <div key={q.id} className="space-y-4">
            <p className="text-base font-medium">{q.question}</p>
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
                      "flex flex-col items-center justify-center w-full p-4 text-gray-500 border border-gray-200 min-h-[60px] transition-all duration-200 whitespace-nowrap",
                      index % 2 === 0 ? "rounded-l-lg" : "rounded-r-lg",
                      profileAnswers[q.id] === option.value ? "bg-black text-white border-black" : "hover:text-gray-600 hover:bg-gray-100"
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
          className="w-full p-4 text-lg font-medium bg-black text-white rounded-lg"
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
          <Button className="w-full sm:w-auto px-6 py-3 bg-black text-white text-sm sm:text-base font-medium whitespace-nowrap rounded-md uppercase">
            {t.redeemButton.text || 'RESGATAR'}
          </Button>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">{t.redeemButton.price}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 bg-white max-h-[85vh] flex flex-col fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-lg z-50 w-[90vw] sm:w-full">
        <div className="overflow-y-auto flex-grow">
          <DialogHeader className="p-4">
            <DialogTitle className="text-xl font-bold mb-4 text-center">
              {isSubmitted ? t.redeemButton.modal.titles.thanks : currentStep === 1 ? t.redeemButton.modal.titles.personalData : currentStep === 2 ? t.redeemButton.modal.titles.shippingAddress : t.redeemButton.modal.titles.profile}
            </DialogTitle>
            <ProgressBar 
              currentStep={currentStep - 1} 
              onStepClick={handleStepClick} 
              isSubmitted={isSubmitted}
              titles={{
                personalData: t.redeemButton.modal.titles.personalData,
                shippingAddress: t.redeemButton.modal.titles.shippingAddress,
                profile: t.redeemButton.modal.titles.profile
              }}
            />
          </DialogHeader>
          {isSubmitted ? renderSuccessMessage() : currentStep === 1 ? renderPersonalDataForm() : currentStep === 2 ? renderAddressForm() : renderProfileForm()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

