import { Button } from '../ui/button'

interface SuccessMessageProps {
  onClose: () => void
  t: any
}

export function SuccessMessage({ onClose, t }: SuccessMessageProps) {
  return (
    <div className="p-6 text-center space-y-4">
      <p className="text-gray-600 mb-8">
        {t.redeemButton.modal.success.message}
      </p>
      <Button
        onClick={onClose}
        className="w-full p-4 text-lg font-medium bg-black text-white rounded-lg"
      >
        {t.redeemButton.modal.success.close}
      </Button>
    </div>
  )
}
