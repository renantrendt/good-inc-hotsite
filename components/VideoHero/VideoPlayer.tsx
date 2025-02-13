"use client"

import { useEffect, useRef, useState } from 'react'
import { Dialog } from '../ui/dialog'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Video {
  id: string
  title: string
  startTime: number // tempo em segundos
  thumbnail: string
}

interface VideoPlayerProps {
  video: Video
  videos: Video[]
  onNext?: (index: number) => void
  onPrevious?: () => void
}

import YouTube from 'react-youtube'

export function VideoPlayer({ video, videos, onNext, onPrevious }: VideoPlayerProps) {
  const [isCarouselVisible, setIsCarouselVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  const videoId = 'i5E3VC_hGB0' // ID fixo do vídeo

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: isFullscreen ? 1 : 0,
      start: video.startTime,
      modestbranding: 1,
      rel: 0
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
  }

  const scrollToCurrentVideo = () => {
    const currentButton = document.querySelector(`[data-video-id="${video.id}"]`) as HTMLElement
    if (currentButton && carouselRef.current) {
      const container = carouselRef.current
      const scrollTop = currentButton.offsetTop - (container.clientHeight / 2) + (currentButton.clientHeight / 2)
      container.scrollTo({ top: scrollTop, behavior: 'smooth' })
    }
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
        target.scrollTop < target.scrollHeight - target.clientHeight ||
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
              <div className="w-full h-full">
                <YouTube
                  videoId={videoId}
                  opts={opts}
                  onReady={(event) => {
                    playerRef.current = event.target
                  }}
                  className="w-full h-full"
                  iframeClassName="w-full h-full"
                />
              </div>
              
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
            
            <div className={cn(
              'absolute top-0 h-full bg-black/30 transition-all duration-300 ease-in-out p-4',
              isCarouselVisible ? 'left-0' : '-left-[70px] sm:-left-[calc(200px-60px)]',
              'sm:w-[200px] w-[125px]'
            )}>
              <button 
                onClick={() => setIsCarouselVisible(!isCarouselVisible)}
                className="absolute -right-10 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-center bg-black/30 text-white/60 hover:text-white/90 transition-colors rounded-r-md"
              >
                {isCarouselVisible ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              <div className="relative h-full rounded-md overflow-hidden">
                <div 
                  ref={carouselRef}
                  className="overflow-y-auto scrollbar-none h-full"
                  onScroll={(e) => {
                    const target = e.currentTarget
                    setShowLeftArrow(target.scrollTop > 0)
                    setShowRightArrow(
                      target.scrollTop < target.scrollHeight - target.clientHeight ||
                      videos.indexOf(video) < videos.length - 1
                    )
                  }}
                >
                  <div className="flex flex-col items-end gap-2 min-h-max pr-2">
                    {videos.map((v, index) => (
                      <button
                        key={v.id}
                        data-video-id={v.id}
                        // Removido auto-scroll para permitir navegação livre
                        onClick={() => {
                          const nextIndex = videos.findIndex((video) => video.id === v.id)
                          if (nextIndex !== -1) {
                            onNext && onNext(nextIndex)
                          }
                        }}
                        className={cn(
                          'relative w-[85px] sm:w-[160px] aspect-video mb-2 transition-all duration-300 rounded-md overflow-hidden',
                          v.id === video.id
                            ? 'ring-2 ring-white scale-105'
                            : 'hover:scale-105'
                        )}
                      >
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-full h-full object-cover"
                        />
                        <div className={cn(
                          'absolute inset-0 flex items-center justify-center transition-all duration-300',
                          v.id === video.id
                            ? 'bg-black/60'
                            : 'bg-black/40 hover:bg-black/60'
                        )}>
                          <span className="text-[10px] sm:text-sm text-white font-medium drop-shadow-md text-center px-1 sm:px-2 leading-tight">
                            {v.title}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {showLeftArrow && (
                  <button
                    onClick={() => {
                      if (onPrevious) {
                        onPrevious()
                        setTimeout(scrollToCurrentVideo, 100)
                      }
                    }}
                    className={cn(
                      'absolute left-0 right-0 top-0 h-8 flex items-center justify-center transition-colors',
                      !onPrevious
                        ? 'text-white/30 cursor-not-allowed'
                        : 'text-white/60 hover:text-white/90 cursor-pointer'
                    )}
                    disabled={!onPrevious}
                  >
                    <span className="text-xs">▲</span>
                  </button>
                )}

                {showRightArrow && (
                  <button
                    onClick={() => {
                      if (onNext) {
                        const nextIndex = videos.findIndex((v) => v.id === video.id) + 1
                        if (nextIndex < videos.length) {
                          onNext(nextIndex)
                          setTimeout(scrollToCurrentVideo, 100)
                        }
                      }
                    }}
                    className={cn(
                      'absolute left-0 right-0 bottom-0 h-8 flex items-center justify-center transition-colors',
                      videos.findIndex((v) => v.id === video.id) === videos.length - 1
                        ? 'text-white/30 cursor-not-allowed'
                        : 'text-white/60 hover:text-white/90 cursor-pointer'
                    )}
                    disabled={videos.findIndex((v) => v.id === video.id) === videos.length - 1}
                  >
                    <span className="text-xs">▼</span>
                  </button>
                )}
              </div>
            </div>
            {/* Overlay para fechar o carrossel em telas pequenas quando aberto */}
            {isCarouselVisible && (
              <div 
                className="fixed inset-0 bg-black/0 sm:hidden z-10"
                onClick={() => setIsCarouselVisible(false)}
              />
            )}
          </div>
        </Dialog>
      )}
    </>
  )
}
