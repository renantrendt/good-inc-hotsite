"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"

export default function FAQ() {
  const { language } = useLanguage()
  const t = translations[language]
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section className="pt-6 pb-16 sm:pt-10 sm:pb-20 bg-white relative z-40">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 uppercase">{t.faq.title}</h2>
        <div className="w-full mx-auto">
          {t.faq.questions.filter(faq => faq.showInFAQ !== false).map((faq, index) => (
            <motion.div key={index} className="mb-4 border border-gray-200 rounded-lg overflow-hidden" initial={false}>
              <button
                className="w-full text-left p-4 flex justify-between items-center hover:bg-primary/10 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-sm sm:text-base">{faq.question}</span>
                {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <AnimatePresence initial={false}>
                {expandedIndex === index && (
                  <motion.div
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-4">
                      <p className="text-sm sm:text-base whitespace-pre-wrap">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

