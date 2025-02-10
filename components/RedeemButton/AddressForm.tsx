import { FormData } from './types'
import { FloatingLabelInput } from './FloatingLabelInput'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

interface AddressFormProps {
  formData: FormData
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleCEPChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAddressSubmit: (e: React.FormEvent) => void
  addressErrors: Record<string, string>
  isLoadingAddress: boolean
  language: 'en' | 'pt'
  t: any
}

export function AddressForm({
  formData,
  handleInputChange,
  handleCEPChange,
  handleAddressSubmit,
  addressErrors,
  isLoadingAddress,
  language,
  t
}: AddressFormProps) {
  return (
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
                language={language}
                numeric
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

        <div className="flex gap-1.5">
          <div className="flex-[4]">
            <FloatingLabelInput
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              label={t.redeemButton.modal.form.street}
              required
              disabled={false}
              language={language}
            />
            {addressErrors.street && (
              <p className="text-sm text-red-500 mt-1">{addressErrors.street}</p>
            )}
          </div>
          {language === 'pt' && (
            <div className="w-24">
              <FloatingLabelInput
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                label={t.redeemButton.modal.form.number}
                required
                language={language}
                numeric
              />
              {addressErrors.number && (
                <p className="text-xs text-red-500 mt-0.5">{addressErrors.number}</p>
              )}
            </div>
          )}
        </div>

        {language === 'pt' ? (
          <>
            <div className="flex gap-1.5">
              <div className="flex-1">
                <FloatingLabelInput
                  id="complement"
                  name="complement"
                  value={formData.complement}
                  onChange={handleInputChange}
                  label={t.redeemButton.modal.form.complement}
                  language={language}
                />
              </div>
              <div className="flex-1">
                <FloatingLabelInput
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  label="Bairro"
                  required
                  language={language}
                />
                {addressErrors.neighborhood && (
                  <p className="text-sm text-red-500 mt-1">{addressErrors.neighborhood}</p>
                )}
              </div>
            </div>

            <div className="w-full">
              <FloatingLabelInput
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                label="Cidade"
                required
                language={language}
              />
              {addressErrors.city && (
                <p className="text-sm text-red-500 mt-1">{addressErrors.city}</p>
              )}
            </div>
          </>
        ) : (
          <div>
            <div className="w-full mb-1.5">
              <FloatingLabelInput
                id="complement"
                name="complement"
                value={formData.complement}
                onChange={handleInputChange}
                label={t.redeemButton.modal.form.complement}
                language={language}
              />
            </div>
            <div className="w-full">
              <FloatingLabelInput
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                label="City"
                required
                language={language}
              />
              {addressErrors.city && (
                <p className="text-sm text-red-500 mt-1">{addressErrors.city}</p>
              )}
            </div>
          </div>
        )}
        {language === 'pt' ? (
          <div className="flex gap-2">
          <div className="flex-1">
            <FloatingLabelInput
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              label="Estado"
              required
              language={language}
            />
            {addressErrors.state && (
              <p className="text-sm text-red-500 mt-1">{addressErrors.state}</p>
            )}
          </div>
            <div className="flex-1">
              <FloatingLabelInput
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                label="País"
                required
                language={language}
              />
              {addressErrors.country && (
                <p className="text-sm text-red-500 mt-1">{addressErrors.country}</p>
              )}
        </div>
          </div>
        ) : (
          <div className="flex gap-2">
          <div className="flex-1">
            <FloatingLabelInput
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              label="State"
              required
              language={language}
            />
            {addressErrors.state && (
              <p className="text-sm text-red-500 mt-1">{addressErrors.state}</p>
            )}
          </div>
            <div className="flex-1">
              <FloatingLabelInput
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                label="Country"
                required
                language={language}
              />
              {addressErrors.country && (
                <p className="text-sm text-red-500 mt-1">{addressErrors.country}</p>
              )}
        </div>
          </div>
        )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          type="submit"
          className="w-full py-3 text-sm font-medium bg-black text-white rounded-lg"
        >
          {language === 'pt' ? "Próximo" : "Next"}
        </Button>
        </div>
      </div>
    </form>
  )
}
