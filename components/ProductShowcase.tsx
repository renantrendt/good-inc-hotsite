"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import WeeklyProgress from "./WeeklyProgress"
import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"

export default function ProductShowcase() {
  const { language } = useLanguage()
  const t = translations[language]

  const [activeProduct, setActiveProduct] = useState(0)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
    setStartX(e.targetTouches[0].pageX - (scrollRef.current?.offsetLeft || 0))
    setScrollLeft(scrollRef.current?.scrollLeft || 0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
    if (!isDragging) return
    const x = e.targetTouches[0].pageX - (scrollRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      setActiveProduct((prev) => (prev + 1) % products.length)
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      setActiveProduct((prev) => (prev - 1 + products.length) % products.length)
    }
  }

  const products = [
    {
      name: t.products.treatment.name,
      volume: t.products.treatment.volume,
      description: t.products.treatment.description,
      why: t.products.treatment.why,
      image: "/images/products/treatment-pre.jpeg",
      directions: t.products.treatment.directions,
      explanation: t.products.treatment.explanation,
      faqTitle: t.products.treatment.faqTitle,
      productInfo: t.products.treatment.productInfo,
      faqItems: [
        {
          question: t.faq.questions[8].question, // "Recommended routine"
          answer: t.faq.questions[8].answer,
        },
      ],
    },
    {
      name: t.products.protector.name,
      volume: t.products.protector.volume,
      description: t.products.protector.description,
      why: t.products.protector.why,
      image: "/images/products/treatment-post.jpeg",
      directions: t.products.protector.directions,
      explanation: t.products.protector.explanation,
      faqTitle: t.products.protector.faqTitle,
      productInfo: t.products.protector.productInfo,
      faqItems: [
        {
          question: t.faq.questions[8].question, // "Recommended routine"
          answer: t.faq.questions[8].answer,
        },
      ],
    },
    {
      name: t.products.cleanser.name,
      volume: t.products.cleanser.volume,
      description: t.products.cleanser.description,
      why: t.products.cleanser.why,
      image: "/images/products/cleanser.jpeg",
      directions: t.products.cleanser.directions,
      explanation: t.products.cleanser.explanation,
      faqTitle: t.products.cleanser.faqTitle,
      productInfo: t.products.cleanser.productInfo,
      faqItems: [
        {
          question: t.faq.questions[8].question, // "Recommended routine"
          answer: t.faq.questions[8].answer,
        },
      ],
    },
    {
      name: t.products.deodorant.name,
      volume: t.products.deodorant.volume,
      description: t.products.deodorant.description,
      why: t.products.deodorant.why,
      image: "/images/products/deodorant.jpeg",
      directions: t.products.deodorant.directions,
      explanation: t.products.deodorant.explanation,
      faqTitle: t.products.deodorant.faqTitle,
      productInfo: t.products.deodorant.productInfo,
      faqItems: [
        {
          question: t.faq.questions[8].question, // "Recommended routine"
          answer: t.faq.questions[8].answer,
        },
      ],
    },
  ]

  const toggleFAQ = (faq: string) => {
    setExpandedFAQ(expandedFAQ === faq ? null : faq)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0))
    setScrollLeft(scrollRef.current?.scrollLeft || 0)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollPosition = scrollRef.current.scrollLeft
        const productWidth = scrollRef.current.offsetWidth
        const newActiveProduct = Math.round(scrollPosition / productWidth)
        setActiveProduct(newActiveProduct)
      }
    }

    scrollRef.current?.addEventListener("scroll", handleScroll)
    return () => scrollRef.current?.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToProduct = (index: number) => {
    if (scrollRef.current) {
      const productWidth = scrollRef.current.offsetWidth
      scrollRef.current.scrollTo({
        left: index * productWidth,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    scrollToProduct(activeProduct)
  }, [activeProduct, scrollToProduct]) // Added scrollToProduct to dependencies

  useEffect(() => {
    const handleResize = () => {
      scrollToProduct(activeProduct)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [activeProduct, scrollToProduct]) // Added scrollToProduct to dependencies

  return (
    <section
      className="t-4 pb-12 sm:pt-4 sm:pb-12 bg-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-8 sm:mb-16">
            <div className="inline-flex items-center justify-center bg-[rgb(255,244,240)] w-full">
              {products.map((product, index) => (
                <button
                  key={product.name}
                  onClick={() => setActiveProduct(index)}
                  className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 transition-all text-xs sm:text-sm whitespace-nowrap ${
                    activeProduct === index
                      ? "bg-black text-white rounded-md"
                      : "bg-[rgb(255,244,240)] text-gray-600"
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div className="md:sticky md:top-4 h-fit">
              <Image
                src={products[activeProduct].image || "/placeholder.svg"}
                alt={products[activeProduct].name}
                width={400}
                height={400}
                className="rounded-lg w-full"
              />
              <div className="mt-4">
                <WeeklyProgress />
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeProduct}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col"
              >
                <h3 className="text-2xl sm:text-3xl font-bold mb-1">{products[activeProduct].name}</h3>
                <p className="text-base sm:text-lg mb-3 sm:mb-4">{products[activeProduct].volume}</p>
                <p className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">{products[activeProduct].description}</p>
                <p className="mb-6 sm:mb-8">{products[activeProduct].why}</p>

                <div className="space-y-4">
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleFAQ("directions")}
                      className="w-full py-3 sm:py-4 flex justify-between items-center text-left"
                    >
                      <span className="text-base sm:text-lg font-semibold">
                        {products[activeProduct].productInfo.directions}
                      </span>
                      {expandedFAQ === "directions" ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    <AnimatePresence>
                      {expandedFAQ === "directions" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pb-3 sm:pb-4"
                        >
                          <p className="mb-3 sm:mb-4">{products[activeProduct].directions}</p>
                          <p className="font-semibold mb-2">
                            {products[activeProduct].productInfo.instructions}
                          </p>
                          {'usage' in products[activeProduct].productInfo && (
                            <p className="text-gray-600">
                              {(products[activeProduct].productInfo as any).usage}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleFAQ("explanation")}
                      className="w-full py-3 sm:py-4 flex justify-between items-center text-left"
                    >
                      <span className="text-base sm:text-lg font-semibold">{products[activeProduct].faqTitle}</span>
                      {expandedFAQ === "explanation" ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    <AnimatePresence>
                      {expandedFAQ === "explanation" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pb-3 sm:pb-4"
                        >
                          <p className="whitespace-pre-wrap">{products[activeProduct].explanation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {products[activeProduct].faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-200">
                      <button
                        onClick={() => toggleFAQ(`faq-${index}`)}
                        className="w-full py-3 sm:py-4 flex justify-between items-center text-left"
                      >
                        <span className="text-base sm:text-lg font-semibold">{item.question}</span>
                        {expandedFAQ === `faq-${index}` ? <ChevronUp /> : <ChevronDown />}
                      </button>
                      <AnimatePresence>
                        {expandedFAQ === `faq-${index}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pb-3 sm:pb-4"
                          >
                            <p className="whitespace-pre-wrap">{item.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div id="product-showcase-end" className="h-1" />
    </section>
  )
}

