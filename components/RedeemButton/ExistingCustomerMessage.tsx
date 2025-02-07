export interface ExistingCustomerMessageProps {
  t: any
}

export function ExistingCustomerMessage({ t }: ExistingCustomerMessageProps) {
  return (
    <div className="p-6 text-center">
      <p className="text-gray-600">
        {t.redeemButton.modal.existingCustomer.message}
        <a
          href={`mailto:${t.redeemButton.modal.existingCustomer.supportEmail}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {t.redeemButton.modal.existingCustomer.supportLink}
        </a>
        {t.redeemButton.modal.existingCustomer.messageSuffix}
      </p>
    </div>
  )
}
