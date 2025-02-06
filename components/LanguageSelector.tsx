"use client"

import { useEffect, useState } from "react"
import { Globe } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("/api/geolocation")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data && data.country_code) {
          setLanguage(data.country_code === "BR" ? "pt" : "en")
        } else {
          throw new Error("Country code not found in response")
        }
      } catch (error) {
        console.error("Error detecting country:", error)
        // Default to English if there's an error
        setLanguage("en")
      } finally {
        setIsLoading(false)
      }
    }

    detectCountry()
  }, [setLanguage])

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "pt" : "en")
  }

  if (isLoading) {
    return <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-8 h-8 bg-transparent hover:bg-gray-100 rounded-full transition-colors duration-200 mr-2"
      aria-label={language === "en" ? "Switch to Portuguese" : "Mudar para Inglês"}
    >
      <Globe size={20} />
    </button>
  )
}

