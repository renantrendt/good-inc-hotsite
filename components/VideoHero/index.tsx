"use client"

import { useState } from 'react'
import { VideoPlayer } from './VideoPlayer'
import { useLanguage } from "../../contexts/LanguageContext"
import translations from "../../utils/translations"
import { mediaItems } from "../../utils/constants"

// Exemplo de vídeos - substitua pelos seus vídeos do Instagram
const videos = [
  {
    id: '1',
    title: 'Why Good',
    url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/videos/hero-video-1-NoOVGDVcqSPc7VYCUAGnTzLTG2qEM2.mp4',
    thumbnail: '/images/products/hero-video.png'
  },
  {
    id: '2',
    title: 'Discovery: Sweat',
    url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/videos/hero-video-2-7VYCUAGnTzLTG2qEM2NoOVGDVcqSPc.mp4',
    thumbnail: '/images/products/hero-video.png'
  },
  {
    id: '3',
    title: 'Discovery: Odor',
    url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/videos/hero-video-3-TzLTG2qEM2NoOVGDVcqSPc7VYCUAG.mp4',
    thumbnail: '/images/products/hero-video.png'
  },
  {
    id: '4',
    title: 'Longevity',
    url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/videos/hero-video-4-qEM2NoOVGDVcqSPc7VYCUAGnTzLTG2.mp4',
    thumbnail: '/images/products/hero-video.png'
  },
  {
    id: '5',
    title: 'Vídeo 5',
    url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/videos/hero-video-5-VcqSPc7VYCUAGnTzLTG2qEM2NoOVGD.mp4',
    thumbnail: '/images/products/hero-video.png'
  },
  {
    id: '6',
    title: 'Vídeo 6',
    url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/videos/hero-video-6-UAGnTzLTG2qEM2NoOVGDVcqSPc7VYC.mp4',
    thumbnail: '/images/products/hero-video.png'
  },
  {
    id: '7',
    title: 'Vídeo 7',
    url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/videos/hero-video-7-LTG2qEM2NoOVGDVcqSPc7VYCUAGnTz.mp4',
    thumbnail: '/images/products/hero-video.png'
  },
  {
    id: '8',
    title: 'Vídeo 8',
    url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/videos/hero-video-8-2NoOVGDVcqSPc7VYCUAGnTzLTG2qEM.mp4',
    thumbnail: '/images/products/hero-video.png'
  },
  {
    id: '9',
    title: 'Vídeo 9',
    url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/videos/hero-video-9-7VYCUAGnTzLTG2qEM2NoOVGDVcqSPc.mp4',
    thumbnail: '/images/products/hero-video.png'
  },
  {
    id: '10',
    title: 'Vídeo 10',
    url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/videos/hero-video-10-TzLTG2qEM2NoOVGDVcqSPc7VYCUAG.mp4',
    thumbnail: '/images/products/hero-video.png'
  }
]

export function VideoHero() {
  const { language } = useLanguage()
  const t = translations[language]
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleNext = (index?: number) => {
    if (typeof index === 'number') {
      setCurrentVideoIndex(index)
    } else {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
    }
  }

  const handlePrevious = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)
  }

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (e.currentTarget as HTMLDivElement).offsetLeft)
    setScrollLeft((e.currentTarget as HTMLDivElement).scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (e.currentTarget as HTMLDivElement).offsetLeft
    const walk = (x - startX) * 2
    e.currentTarget.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
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
