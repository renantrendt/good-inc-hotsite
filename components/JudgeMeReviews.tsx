"use client"

import { useEffect, useRef } from "react"
import { useLanguage } from "../contexts/LanguageContext"

declare global {
  interface Window {
    jdgm: any
  }
}

// Dicionário de traduções
const translations = {
  en: {
    "Customer Reviews": "Customer Reviews",
    "Verified Buyer": "Verified Buyer",
    "days ago": "days ago",
    googleReviews: "+4.7K GOOGLE REVIEWS",
  },
  pt: {
    "Customer Reviews": "Avaliações dos Clientes",
    "Verified Buyer": "Comprador Verificado",
    "days ago": "dias atrás",
    googleReviews: "+4.7 MIL AVALIAÇÕES GOOGLE",
  },
}

export default function JudgeMeReviews() {
  const { language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Inicializar Judge.me
    window.jdgm = window.jdgm || {}
    window.jdgm.SHOP_DOMAIN = "vqj.hdb.mybluehost.me"
    window.jdgm.PLATFORM = "woocommerce"
    window.jdgm.PUBLIC_TOKEN = "OAaz7JTbkx2Psmv7BR9qf4Q3MKc"

    // Carregar script do Judge.me
    const script = document.createElement("script")
    script.src = "https://cdn.judge.me/widget_preloader.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const translateReviews = () => {
      if (containerRef.current) {
        const elements = containerRef.current.querySelectorAll("[data-translation-key]")
        elements.forEach((element) => {
          const key = element.getAttribute("data-translation-key")
          if (key && translations[language][key]) {
            element.textContent = translations[language][key]
          }
        })
      }
    }

    // Observar mudanças no DOM para traduzir novos elementos
    const observer = new MutationObserver(translateReviews)
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true })
    }

    // Traduzir elementos existentes
    translateReviews()

    return () => observer.disconnect()
  }, [language])

  return (
    <section className="pt-12 pb-1 bg-white">
      <div className="container mx-auto px-4">
        <div ref={containerRef}>
          <h2 className="text-2xl font-bold text-center mb-6">
            <a
              href="https://www.visto.bio/p/opinioes"
              className="hover:opacity-80 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {language === "pt" ? translations.pt.googleReviews : translations.en.googleReviews}
            </a>
          </h2>
          {language === "pt" && <div className="jdgm-carousel-wrapper" data-auto-play="5000"></div>}
        </div>
      </div>
    </section>
  )
}

