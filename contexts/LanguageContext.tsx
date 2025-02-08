"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { debug } from "../lib/debug"

type Language = "en" | "pt"

interface GeoData {
  country_code: string
  country_name: string
  city: string
  region: string
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  geoData: GeoData | null
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en') // Inicializa com inglês no servidor
  const [geoData, setGeoData] = useState<GeoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Inicialização no cliente
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
      setIsLoading(false)
    }
  }, [])

  const updateLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage)
    }
  }

  useEffect(() => {
    async function detectLocation() {
      if (typeof window === 'undefined') return

      try {
        debug.log('Language', 'Detecting location...')
        const response = await fetch('/api/geolocation')
        const data = await response.json()
        debug.log('Language', 'Location data:', data)
        
        setGeoData(data)

        // Se não tiver idioma salvo, define com base no país
        if (!localStorage.getItem('language') && data.country_code === 'BR') {
          debug.log('Language', 'Brazilian IP detected, switching to PT')
          updateLanguage('pt')
        }
      } catch (error) {
        debug.error('Language', 'Error detecting location:', error)
      } finally {
        setIsLoading(false)
      }
    }

    detectLocation()
  }, [])

  return <LanguageContext.Provider value={{ language, setLanguage, geoData, isLoading }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

