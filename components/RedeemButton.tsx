"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"

export function RedeemButton() {
  const { language } = useLanguage()
  const t = translations[language]
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setIsSubmitted(true)
  }

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
      <DialogContent className="sm:max-w-[425px] text-center bg-white">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">
            {isSubmitted ? t.redeemButton.thankYou : t.redeemButton.redeemTitle}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSubmitted ? t.redeemButton.processingMessage : t.redeemButton.enterDetails}
          </DialogDescription>
        </DialogHeader>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-2 mb-4">
              <Label htmlFor="firstName">{t.redeemButton.firstName}</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full max-w-[300px]"
                required
              />
            </div>
            <div className="flex flex-col items-center gap-2 mb-4">
              <Label htmlFor="lastName">{t.redeemButton.lastName}</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full max-w-[300px]"
                required
              />
            </div>
            <div className="flex flex-col items-center gap-2 mb-4">
              <Label htmlFor="address">{t.redeemButton.address}</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full max-w-[300px]"
                required
              />
            </div>
            <div className="flex flex-col items-center gap-2 mb-4">
              <Label htmlFor="phone">{t.redeemButton.phone}</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full max-w-[300px]"
                required
              />
            </div>
            <div className="flex flex-col items-center gap-2 mb-4">
              <Label htmlFor="email">{t.redeemButton.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full max-w-[300px]"
                required
              />
            </div>
            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                className="w-full max-w-[300px] px-3 sm:px-4 py-2 sm:py-3 bg-black hover:bg-gray-800 text-white text-xs sm:text-sm whitespace-nowrap rounded-md uppercase"
              >
                {t.redeemButton.submit}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full max-w-[300px] px-3 sm:px-4 py-2 sm:py-3 bg-black hover:bg-gray-800 text-white text-xs sm:text-sm whitespace-nowrap rounded-md uppercase"
            >
              {t.redeemButton.close}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

