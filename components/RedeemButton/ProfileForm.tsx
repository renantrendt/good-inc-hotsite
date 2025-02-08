import { FormData, ProfileQuestion } from './types'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
  handleSubmit: (e: React.FormEvent) => void
  handleProfileChange: (id: string, value: string) => void
  formData: FormData
  isSubmitting: boolean
  t: any
}

export function ProfileForm({
  handleSubmit,
  handleProfileChange,
  formData,
  isSubmitting,
  t
}: ProfileFormProps) {
  const fieldMapping: Record<string, keyof FormData> = {
    'clothes_odor': 'clothesOdor',
    'product_understanding': 'productUnderstanding',
    'main_focus': 'mainFocus',
    'referral': 'referral'
  }
  return (
    <form onSubmit={handleSubmit} className="p-3 sm:p-4 pb-16 relative">
      <div className="space-y-4 mb-4 sm:mb-4">
        {t.redeemButton.modal.questions.map((q: ProfileQuestion) => (
          <div key={q.id} className="space-y-1.5">
            <p className="text-sm font-medium">{q.question}</p>
            <RadioGroup
              onValueChange={(value) => handleProfileChange(q.id, value)}
              value={fieldMapping[q.id] ? formData[fieldMapping[q.id]] : ''}
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
                      fieldMapping[q.id] ? formData[fieldMapping[q.id]] === option.value : false ? "bg-black text-white border-black" : "bg-white text-gray-500 hover:bg-gray-50"
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
      <div className="space-y-1.5 mt-3 mb-6 sm:mb-[5em]">
        <p className="text-sm font-medium">{t.redeemButton.modal.form.referral}</p>
        <input
          type="text"
          placeholder=""
          className="w-full p-3 text-sm border border-gray-200 rounded-lg"
          required
          onChange={(e) => handleProfileChange('referral', e.target.value)}
          value={formData.referral || ''}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          type="submit"
          className="w-full py-3 text-sm font-medium bg-black text-white rounded-lg relative"
          disabled={
            !formData.clothesOdor ||
            !formData.productUnderstanding ||
            !formData.mainFocus ||
            !formData.referral ||
            formData.referral.length <= 3 ||
            isSubmitting
          }
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
