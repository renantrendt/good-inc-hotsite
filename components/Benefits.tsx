"use client"

import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"
import { Star } from "lucide-react"

export default function Benefits() {
  const { language } = useLanguage()
  const t = translations[language]

  const benefitsWithSeparators = [
    "separator",
    ...t.benefits.items.flatMap((item, index, array) => (index < array.length - 1 ? [item, "separator"] : [item])),
  ]

  return (
    <section className="bg-[rgb(255,244,240)] overflow-hidden mt-2 mb-12 sm:mt-2 mb-12">
      <div className="whitespace-nowrap">
        <div className="animate-marquee inline-block">
          {benefitsWithSeparators.map((item, index) => (
            <span key={index} className="inline-flex items-center">
              {item === "separator" ? (
                <Star className="mx-4 text-black fill-black" size={16} />
              ) : (
                <span className="text-xs sm:text-sm px-4 uppercase">{item}</span>
              )}
            </span>
          ))}
          {benefitsWithSeparators.map((item, index) => (
            <span key={`repeat-${index}`} className="inline-flex items-center">
              {item === "separator" ? (
                <Star className="mx-4 text-black fill-black" size={16} />
              ) : (
                <span className="text-xs sm:text-sm px-4 uppercase">{item}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

