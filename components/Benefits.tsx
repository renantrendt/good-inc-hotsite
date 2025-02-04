"use client"

import { useState } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"
import { Star } from "lucide-react"

export default function Benefits() {
  const { language } = useLanguage()
  const t = translations[language]
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const benefitsWithSeparators = [
    "separator",
    ...t.benefits.items.flatMap((item, index, array) => (index < array.length - 1 ? [item, "separator"] : [item])),
  ]

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsPaused(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
    const diff = touchStart - e.targetTouches[0].clientX
    setScrollPosition(prev => prev + diff)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    setIsPaused(false)
  }

  return (
    <section className="bg-[rgb(255,244,240)] overflow-hidden mt-2 mb-12 sm:mt-2 mb-12">
      <div 
        className="whitespace-nowrap" 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`inline-block transition-transform ${!isPaused ? 'animate-marquee' : ''}`}
          style={{ transform: `translateX(-${scrollPosition}px)` }}>
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

