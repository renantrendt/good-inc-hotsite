import { FormData } from './types'
import { FloatingLabelInput } from './FloatingLabelInput'
import { Button } from '../ui/button'

interface PersonalDataFormProps {
  formData: FormData
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleNextStep: (e: React.FormEvent) => void
  personalDataErrors: Record<string, string>
  language: 'en' | 'pt'
  t: any
}

export function PersonalDataForm({
  formData,
  handleInputChange,
  handleNextStep,
  personalDataErrors,
  language,
  t
}: PersonalDataFormProps) {
  return (
    <form onSubmit={handleNextStep} className="p-3 sm:p-4 space-y-1.5 pb-28 sm:pb-32 relative">
      <div className="space-y-1.5">
        <div className="flex gap-2">
          <div className="flex-1">
            <FloatingLabelInput
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              label={t.redeemButton.modal.form.firstName}
              required
              language={language}
            />
            {personalDataErrors.firstName && (
              <p className="text-xs text-red-500 mt-0.5">{personalDataErrors.firstName}</p>
            )}
          </div>
          <div className="flex-1">
            <FloatingLabelInput
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              label={t.redeemButton.modal.form.lastName}
              required
              language={language}
            />
            {personalDataErrors.lastName && (
              <p className="text-xs text-red-500 mt-0.5">{personalDataErrors.lastName}</p>
            )}
          </div>
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
            language={language}
          />
          {personalDataErrors.email && (
            <p className="text-xs text-red-500 mt-0.5">{personalDataErrors.email}</p>
          )}
        </div>
        <div>
          <div className="flex gap-2">
            <div className="w-16">
              <FloatingLabelInput
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                label={language === 'pt' ? "País" : "Country"}
                required
                type="tel"
                language={language}
              />
              {personalDataErrors.countryCode && (
                <p className="text-xs text-red-500 mt-0.5">{personalDataErrors.countryCode}</p>
              )}
            </div>

            {language === 'pt' && (
              <div className="w-14">
                <FloatingLabelInput
                  id="cityCode"
                  name="cityCode"
                  value={formData.cityCode}
                  onChange={handleInputChange}
                  label="DDD"
                  required
                  language={language}
                  numeric
                />
                {personalDataErrors.cityCode && (
                  <p className="text-xs text-red-500 mt-0.5">{personalDataErrors.cityCode}</p>
                )}
              </div>
            )}
            <div className="flex-1">
              <FloatingLabelInput
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                label={language === 'pt' ? "Celular" : "Phone"}
                type="tel"
                numeric
                required
                language={language}
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
              language={language}
              numeric
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
}
