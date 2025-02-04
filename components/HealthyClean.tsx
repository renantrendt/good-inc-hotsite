"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Globe, Recycle } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"

const icons = [
  { icon: CheckCircle, className: "w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4" },
  { icon: Globe, className: "w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" },
  { icon: Recycle, className: "w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4" },
]

export default function HealthyClean() {
  const { language } = useLanguage()
  const t = translations[language].healthyClean
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % t.cards.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [t.cards.length])

  return (
    <section className="pt-12 pb-12 sm:pt-20 sm:pb-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
          {t.cards.map((card, index) => {
            const IconComponent = icons[index].icon
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200 text-center flex flex-col justify-between min-h-[200px]"
              >
                <IconComponent className={icons[index].className} />
                <h3 className="text-lg sm:text-xl font-semibold mb-2 uppercase">{card.title}</h3>
                <p className="text-sm sm:text-base whitespace-pre-line">{card.description}</p>
              </div>
            )
          })}
        </div>

        {/* Mobile and Tablet View */}
        <div className="lg:hidden">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {t.cards.map((card, index) => {
                const IconComponent = icons[index].icon
                return (
                  <div key={index} className="w-full flex-shrink-0 px-4 flex">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center flex flex-col justify-between w-full min-h-[200px]">
                      <IconComponent className={icons[index].className} />
                      <h3 className="text-lg font-semibold mb-2 uppercase">{card.title}</h3>
                      <p className="text-sm whitespace-pre-line">{card.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

