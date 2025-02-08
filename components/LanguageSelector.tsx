"use client"

import { useEffect, useState } from "react"
import { Globe } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { debug } from "../lib/debug"

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detectCountry = async () => {
      debug.log('Language', 'Iniciando detecção de idioma...')
      
      // Verificar se estamos em modo anônimo/privado
      let isPrivateMode = false
      try {
        localStorage.setItem('test', 'test')
        localStorage.removeItem('test')
      } catch (e) {
        isPrivateMode = true
        debug.log('Language', 'Modo anônimo detectado, sempre usará detecção por IP')
      }

      // Verificar se já existe um idioma salvo (se não estiver em modo anônimo)
      if (typeof window !== 'undefined' && !isPrivateMode) {
        const savedLanguage = localStorage.getItem('language')
        debug.log('Language', 'Idioma salvo:', savedLanguage)
        
        if (savedLanguage === 'pt' || savedLanguage === 'en') {
          debug.log('Language', 'Usando idioma salvo:', savedLanguage)
          setLanguage(savedLanguage)
          setIsLoading(false)
          return
        }
      }

      try {
        debug.log('Language', 'Buscando localização do IP...')
        const response = await fetch("/api/geolocation")
        
        if (!response.ok) {
          debug.error('Language', 'Erro HTTP:', response.status)
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        debug.log('Language', 'Dados de localização recebidos:', data)
        
        if (data && data.country_code) {
          const detectedLanguage = data.country_code === "BR" ? "pt" : "en"
          debug.log('Language', 'Idioma detectado:', detectedLanguage, 'para país:', data.country_code)
          setLanguage(detectedLanguage)
          try {
            localStorage.setItem('language', detectedLanguage)
            debug.log('Language', 'Preferência de idioma salva com sucesso')
          } catch (e) {
            debug.log('Language', 'Não foi possível salvar preferência (modo anônimo)')
          }
        } else {
          debug.error('Language', 'Código do país não encontrado na resposta')
          throw new Error("Country code not found in response")
        }
      } catch (error) {
        debug.error('Language', 'Erro ao detectar país:', error)
        // Default to English if there's an error
        debug.log('Language', 'Usando inglês como fallback')
        setLanguage("en")
        try {
          localStorage.setItem('language', 'en')
          console.log('✅ [Language] Preferência de idioma salva com sucesso')
        } catch (e) {
          console.log('🌐 [Language] Não foi possível salvar preferência (modo anônimo)')
        }
      } finally {
        setIsLoading(false)
      }
    }

    detectCountry()
  }, [setLanguage])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "pt" : "en"
    debug.log('Language', 'Alterando idioma para:', newLanguage)
    setLanguage(newLanguage)
    try {
      localStorage.setItem('language', newLanguage)
      console.log('✅ [Language] Preferência de idioma salva com sucesso')
    } catch (e) {
      console.log('🌐 [Language] Não foi possível salvar preferência (modo anônimo)')
    }
  }

  if (isLoading) {
    return <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-8 h-8 bg-transparent hover:bg-gray-100 rounded-full transition-colors duration-200 mr-2"
      aria-label={language === "en" ? "Switch to Portuguese" : "Mudar para Inglês"}
      title={language === "en" ? "Mudar para Português" : "Switch to English"}
    >
      <Globe size={20} />
    </button>
  )
}

