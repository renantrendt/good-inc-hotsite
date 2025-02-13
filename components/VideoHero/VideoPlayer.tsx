"use client"

import { useEffect, useRef, useState } from 'react'
import { Dialog } from '../ui/dialog'
import { cn } from '@/lib/utils'

interface Video {
  id: string
  title: string
  url: string
  thumbnail: string
}

interface VideoPlayerProps {
  video: Video
  videos: Video[]
  onNext?: (index: number) => void
  onPrevious?: () => void
}

export function VideoPlayer({ video, videos, onNext, onPrevious }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && onNext) {
        const nextIndex = videos.findIndex((v) => v.id === video.id) + 1
        if (nextIndex < videos.length) {
          onNext(nextIndex)
        }
      } else if (swipeDistance < 0 && onPrevious) {
        onPrevious()
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowRight' && onNext) {
          const nextIndex = videos.findIndex((v) => v.id === video.id) + 1
          if (nextIndex < videos.length) {
            onNext(nextIndex)
          }
        } else if (e.key === 'ArrowLeft' && onPrevious) {
          onPrevious()
        } else if (e.key === 'Escape') {
          setIsFullscreen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, onNext, onPrevious, video.id, videos])

  useEffect(() => {
    // Verificar se há botões à direita quando o modal abre
    if (isFullscreen && carouselRef.current) {
      const target = carouselRef.current
      setShowRightArrow(
        target.scrollLeft < target.scrollWidth - target.clientWidth || 
        videos.indexOf(video) < videos.length - 1
      )
    }
  }, [isFullscreen, video, videos])

  return (
    <>
      <div className="w-full rounded-lg shadow-lg overflow-hidden bg-white">
        <div
          className="relative w-full aspect-video cursor-pointer group"
          onClick={() => setIsFullscreen(true)}
        >
          <div className="relative w-full h-full">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 z-20 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-80 flex items-center justify-center transition-all duration-300 transform scale-75 group-hover:scale-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && (
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsFullscreen(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="aspect-video bg-black relative">
              <video
                src={video.url}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                controls
              />
              
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/20 rounded-full z-10 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-0">
              <div className="relative bg-white rounded-md overflow-hidden">
                <div 
                  ref={carouselRef}
                  className="overflow-x-auto scrollbar-none"
                  onScroll={(e) => {
                    const target = e.currentTarget
                    setShowLeftArrow(target.scrollLeft > 0)
                    setShowRightArrow(
                      target.scrollLeft < target.scrollWidth - target.clientWidth ||
                      videos.indexOf(video) < videos.length - 1
                    )
                  }}
                >
                  <div className="flex gap-2 min-w-max p-2">
                    {videos.map((v, index) => (
                      <button
                        key={v.id}
                        ref={v.id === video.id ? (el) => {
                          if (el && carouselRef.current) {
                            const container = carouselRef.current
                            const button = el
                            const scrollLeft = button.offsetLeft - (container.clientWidth / 2) + (button.clientWidth / 2)
                            container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
                          }
                        } : undefined}
                        onClick={() => {
                          const nextIndex = videos.findIndex((video) => video.id === v.id)
                          if (nextIndex !== -1) {
                            onNext && onNext(nextIndex)
                          }
                        }}
                        className={cn(
                          'px-4 py-2 transition-all text-xs sm:text-sm whitespace-nowrap rounded-md',
                          v.id === video.id
                            ? 'bg-black text-white'
                            : 'bg-[rgb(255,244,240)] text-gray-600 hover:bg-black/5'
                        )}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>

                {showLeftArrow && (
                  <div className="absolute left-0 top-0 bottom-0 flex items-center">
                    <button
                      onClick={() => onPrevious && onPrevious()}
                      className="p-2 backdrop-blur-sm bg-white/30 hover:bg-white/50 text-gray-600 rounded-r-md transition-colors"
                      disabled={!onPrevious}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                  </div>
                )}

                {showRightArrow && (
                  <div className="absolute right-0 top-0 bottom-0 flex items-center">
                    <button
                      onClick={() => {
                        if (onNext) {
                          const nextIndex = videos.findIndex((v) => v.id === video.id) + 1
                          if (nextIndex < videos.length) {
                            onNext(nextIndex)
                          }
                        }
                      }}
                      className="p-2 backdrop-blur-sm bg-white/30 hover:bg-white/50 text-gray-600 rounded-l-md transition-colors"
                      disabled={!onNext}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}
