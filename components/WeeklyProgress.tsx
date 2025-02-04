"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"

export default function WeeklyProgress() {
  const { language } = useLanguage()
  const t = translations[language].weeklyProgress
  const [activeWeek, setActiveWeek] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWeek((prevWeek) => (prevWeek % 5) + 1)
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-1 bg-white">
      <div className="container mx-auto px-4">
        <div className="h-12 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeWeek}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-xs sm:text-sm text-center px-4 leading-tight"
            >
              {t.week} {activeWeek}: {t.descriptions[activeWeek - 1]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

