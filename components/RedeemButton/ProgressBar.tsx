import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ProgressBarProps {
  currentStep: number
  onStepClick: (step: number) => void
  isSubmitted?: boolean
}

export function ProgressBar({ currentStep, onStepClick, isSubmitted }: ProgressBarProps) {
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
