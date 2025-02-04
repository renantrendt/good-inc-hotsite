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

function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = ["Dados Pessoais", "Perfil"]

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "text-sm whitespace-nowrap absolute -top-6",
              "left-1/2 transform -translate-x-1/2",
              index < currentStep ? "text-black font-medium" : index === currentStep ? "text-black" : "text-gray-400",
            )}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="relative flex items-center justify-center flex-1">
              <div className={cn("w-full h-[2px]", index <= currentStep ? "bg-black" : "bg-gray-200")} />
              <div
                className={cn(
                  "absolute flex items-center justify-center w-8 h-8 rounded-full border-2",
                  index < currentStep
                    ? "bg-black border-black text-white"
                    : index === currentStep
                      ? "border-black bg-white text-black"
                      : "border-gray-200 bg-white text-gray-400",
                )}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
              </div>
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

const profileQuestions: ProfileQuestion[] = [
  {
    id: "clothes_odor",
    question: "Você percebe que algumas roupas dão mais mau cheiro que outras?",
    options: [
      { value: "yes", label: "Sim" },
      { value: "no", label: "Não" },
    ],
  },
  {
    id: "product_understanding",
    question:
      "Você entendeu que a parte mais importante para preservar sua saúde está no uso continuado dos produtos que tratam e protegem tecidos?",
    options: [
      { value: "yes", label: "Sim" },
      { value: "no", label: "Não" },
    ],
  },
  {
    id: "main_focus",
    question: "Seu foco está em longevidade ou resolver um problema de odor/suor?",
    options: [
      { value: "longevity", label: "Longevidade" },
      { value: "problem_solving", label: "Resolver problema" },
    ],
  },
]

export function RedeemButton() {
  const { language } = useLanguage()
  const t = translations[language]
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    cpf: "",
    email: "",
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
    setCurrentStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.keys(profileAnswers).length !== profileQuestions.length) {
      return // Prevent submission if not all questions are answered
    }
    console.log("Form submitted:", { ...formData, profileAnswers })
    setIsSubmitted(true)
  }

  const renderPersonalDataForm = () => (
    <form onSubmit={handleNextStep} className="p-6 space-y-6">
      <FloatingLabelInput
        id="firstName"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        label="Nome"
        required
      />
      <FloatingLabelInput
        id="lastName"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        label="Sobrenome"
        required
      />
      <FloatingLabelInput
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        label="E-mail"
        type="email"
        required
      />
      <FloatingLabelInput
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        label="Telefone"
        type="tel"
        required
      />
      <FloatingLabelInput id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} label="CPF" required />
      <div className="pt-6 border-t">
        <Button
          type="submit"
          className="w-full p-4 text-lg font-medium bg-black hover:bg-gray-800 text-white rounded-lg"
        >
          Confirmar dados
        </Button>
      </div>
    </form>
  )

  const renderProfileForm = () => (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-12 mb-8">
        {profileQuestions.map((q) => (
          <div key={q.id} className="space-y-4">
            <p className="text-base font-medium">{q.question}</p>
            <RadioGroup
              onValueChange={(value) => handleProfileChange(q.id, value)}
              value={profileAnswers[q.id]}
              className="flex flex-col space-y-4"
              required
            >
              {q.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`${q.id}-${option.value}`} className="w-5 h-5" />
                  <Label htmlFor={`${q.id}-${option.value}`} className="text-base cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
      <div className="pt-6 border-t">
        <Button
          type="submit"
          className="w-full p-4 text-lg font-medium bg-black hover:bg-gray-800 text-white rounded-lg"
          disabled={Object.keys(profileAnswers).length !== profileQuestions.length}
        >
          Finalizar pedido
        </Button>
      </div>
    </form>
  )

  const renderSuccessMessage = () => (
    <div className="p-6 text-center space-y-4">
      <p className="text-gray-600 mb-8">
        Seu pedido foi recebido com sucesso. Em breve nossa equipe entrará em contato através do e-mail cadastrado com
        mais informações.
      </p>
      <Button
        onClick={() => setIsOpen(false)}
        className="w-full p-4 text-lg font-medium bg-black hover:bg-gray-800 text-white rounded-lg"
      >
        Fechar
      </Button>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center">
          <Button className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-gray-800 text-white text-sm sm:text-base font-medium whitespace-nowrap rounded-md uppercase">
            {t.redeemButton.text}
          </Button>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">{t.redeemButton.price}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 bg-white">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold mb-8">
            {currentStep === 1 ? "Dados pessoais" : "Obrigado"}
          </DialogTitle>
          <ProgressBar currentStep={currentStep} />
        </DialogHeader>
        {isSubmitted ? renderSuccessMessage() : currentStep === 1 ? renderPersonalDataForm() : renderProfileForm()}
      </DialogContent>
    </Dialog>
  )
}

