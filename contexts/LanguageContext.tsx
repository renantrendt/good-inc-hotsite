"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "pt"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language
      return savedLanguage || 'en'
    }
    return 'en'
  })

  const updateLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage)
    }
  }

  useEffect(() => {
    async function detectLanguage() {
      // Se já tiver um idioma salvo no localStorage, não precisa detectar
      if (typeof window !== 'undefined' && localStorage.getItem('language')) {
        return
      }

      try {
        console.log('Detecting language from IP...')
        const response = await fetch('/api/geolocation')
        const data = await response.json()
        console.log('Geolocation data:', data)
        
        if (data.country_code === 'BR') {
          console.log('Brazilian IP detected, switching to PT')
          updateLanguage('pt')
        }
      } catch (error) {
        console.error('Error detecting language:', error)
      }
    }

    detectLanguage()
  }, [])

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

