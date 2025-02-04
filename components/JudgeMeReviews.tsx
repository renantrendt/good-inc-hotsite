"use client"

import { useLanguage } from "../contexts/LanguageContext"

const translations = {
  en: {
    googleReviews: "+4.7K GOOGLE REVIEWS",
  },
  pt: {
    googleReviews: "+4.7 MIL AVALIAÇÕES GOOGLE",
  },
}

export default function JudgeMeReviews() {
  const { language } = useLanguage()

  return (
    <section className="pt-12 pb-1 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          <a
            href="https://www.visto.bio/p/opinioes"
            className="hover:opacity-80 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {language === "pt" ? translations.pt.googleReviews : translations.en.googleReviews}
          </a>
        </h2>
      </div>
    </section>
  )
}

