"use client"

import { useState } from 'react'
import { VideoPlayer } from './VideoPlayer'
import { useLanguage } from "../../contexts/LanguageContext"
import translations from "../../utils/translations"
import { mediaItems } from "../../utils/constants"
import { videoChapters } from '../../data/videoChapters'

// Usando os capítulos do vídeo do YouTube
const videos = videoChapters

export function VideoHero() {
  const { language } = useLanguage()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const t = translations[language]

  const handleNext = (index: number) => {
    setCurrentVideoIndex(index)
  }

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1)
    }
  }

  return (
    <section className="bg-[rgb(255,244,240)] text-black py-12 sm:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
            {t.hero.title}
          </h1>
        </div>
        
        <div className="aspect-video w-full max-w-4xl mx-auto mb-12">
          <VideoPlayer
            video={videos[currentVideoIndex]}
            videos={videos}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-2 sm:gap-x-3 w-full max-w-6xl mx-auto px-4">
          {mediaItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <span className="text-[9px] leading-[2] sm:text-[11px] font-bold text-gray-800 whitespace-nowrap">
                {item.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
