"use client"

import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"

export default function JudgeMeReviews() {
  const { language } = useLanguage()

  return (
    <section className="pt-12 pb-1 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-1xl sm:text-3xl font-bold text-center">
          <p>"{language === "pt" ? translations.pt.judgeMeReviews.quote : translations.en.judgeMeReviews.quote}"
          </p><br></br>

          <a
            href="https://www.visto.bio/p/opinioes"
            className="hover:opacity-80 underline text-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            {language === "pt" ? translations.pt.judgeMeReviews.googleReviews : translations.en.judgeMeReviews.googleReviews}
          </a>
        </h2>
      </div>
    </section>
  )
}
