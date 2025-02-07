"use client"

import { useState, useEffect } from "react"
import { RedeemButton } from "./RedeemButton"

export default function RedeemSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    )

    const productSectionEnd = document.getElementById("product-showcase-end")
    if (productSectionEnd) {
      observer.observe(productSectionEnd)
    }

    return () => {
      if (productSectionEnd) {
        observer.unobserve(productSectionEnd)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <section className="fixed bottom-0 left-0 right-0 pt-2 pb-1 bg-white border-t shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <RedeemButton />
        </div>
      </div>
    </section>
  )
}

