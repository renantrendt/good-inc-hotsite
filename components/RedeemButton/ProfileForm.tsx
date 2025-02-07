import { FormData, ProfileQuestion } from './types'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
  handleSubmit: (e: React.FormEvent) => void
  handleProfileChange: (id: string, value: string) => void
  profileAnswers: Record<string, string>
  isSubmitting: boolean
  t: any
}

export function ProfileForm({
  handleSubmit,
  handleProfileChange,
  profileAnswers,
  isSubmitting,
  t
}: ProfileFormProps) {
  return (
    <form onSubmit={handleSubmit} className="p-3 sm:p-4 pb-16 relative">
      <div className="space-y-4 mb-12 sm:mb-24">
        {t.redeemButton.modal.questions.map((q: ProfileQuestion) => (
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
          className="w-full py-3 text-sm font-medium bg-black text-white rounded-lg relative"
          disabled={Object.keys(profileAnswers).length !== t.redeemButton.modal.questions.length || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t.redeemButton.modal.form.finishOrder
          )}
        </Button>
      </div>
    </form>
  )
}
