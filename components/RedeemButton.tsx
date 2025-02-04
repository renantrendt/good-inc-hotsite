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
}: { currentStep: number; onStepClick: (step: number) => void; isSubmitted?: boolean }) {
  const steps = ["Dados Pessoais", "Perfil"]

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

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step + 1)
    }
  }

  const renderPersonalDataForm = () => (
    <form onSubmit={handleNextStep} className="p-6 space-y-4 pb-32 relative">
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
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          type="submit"
          className="w-full p-4 text-lg font-medium bg-black text-white rounded-lg"
        >
          Confirmar dados
        </Button>
      </div>
    </form>
  )

  const renderProfileForm = () => (
    <form onSubmit={handleSubmit} className="p-6 pb-20 relative">
      <div className="space-y-6 mb-4">
        {profileQuestions.map((q) => (
          <div key={q.id} className="space-y-4">
            <p className="text-base font-medium">{q.question}</p>
            <RadioGroup
              onValueChange={(value) => handleProfileChange(q.id, value)}
              value={profileAnswers[q.id]}
              className="grid grid-cols-2 gap-2 w-full"
              required
            >
              {q.options.map((option, index) => (
                <div key={option.value}>
                  <RadioGroupItem value={option.value} id={`${q.id}-${option.value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`${q.id}-${option.value}`}
                    className={cn(
                      "radio-group-item transition-colors",
                      "peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white",
                    )}
                  >
                    {option.label}
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
        className="w-full p-4 text-lg font-medium bg-black text-white rounded-lg"
      >
        Fechar
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
            {t.redeemButton.text}
          </Button>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">{t.redeemButton.price}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 bg-white max-h-[90vh] flex flex-col fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-lg z-50">
        <div className="overflow-y-auto flex-grow">
          <DialogHeader className="p-4">
            <DialogTitle className="text-xl font-bold mb-4">
              {isSubmitted ? "Obrigado!" : currentStep === 1 ? "Dados pessoais" : "Perfil"}
            </DialogTitle>
            <ProgressBar currentStep={currentStep - 1} onStepClick={handleStepClick} isSubmitted={isSubmitted} />
          </DialogHeader>
          {isSubmitted ? renderSuccessMessage() : currentStep === 1 ? renderPersonalDataForm() : renderProfileForm()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

