"use client"

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import YouTube from 'react-youtube'

interface Video {
  id: string
  title: string
  startTime: number
  thumbnail: string
}

interface VideoPlayerProps {
  video: Video
  videos: Video[]
  onNext?: (index: number) => void
  onPrevious?: () => void
}

export function VideoPlayer({ video, videos, onNext, onPrevious }: VideoPlayerProps) {
  const [isCarouselVisible, setIsCarouselVisible] = useState(true)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  const scrollToCurrentVideo = () => {
    if (!carouselRef.current) return

    const currentVideoButton = carouselRef.current.querySelector(
      `[data-video-id="${video.id}-${video.startTime}"]`
    ) as HTMLButtonElement

    if (currentVideoButton) {
      currentVideoButton.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  useEffect(() => {
    scrollToCurrentVideo()
  }, [video.id, video.startTime])

  const handleChapterClick = async (v: Video) => {
    // Se for o mesmo vídeo, apenas navega para o tempo correto
    if (playerRef.current?.internalPlayer && v.id === video.id) {
      await playerRef.current.internalPlayer.seekTo(v.startTime)
      await playerRef.current.internalPlayer.playVideo()
    }
    
    // Em qualquer caso, atualiza o índice para mostrar o capítulo selecionado
    const nextIndex = videos.findIndex((video) => video.id === v.id && video.startTime === v.startTime)
    if (nextIndex !== -1) {
      onNext && onNext(nextIndex)
      // Garante que o vídeo vai dar play após a mudança
      setTimeout(() => {
        if (playerRef.current?.internalPlayer) {
          playerRef.current.internalPlayer.playVideo()
        }
      }, 1000)
    }
  }

  return (
    <div className="relative w-full aspect-video rounded-lg shadow-lg overflow-hidden">
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 z-0">
            <YouTube
              videoId={video.id}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  start: video.startTime,
                  modestbranding: 1,
                  rel: 0,
                  controls: 1,
                  showinfo: 0,
                  fs: 1,
                  playsinline: 1,
                  origin: process.env.NEXT_PUBLIC_SITE_URL,
                  title: 0,
                  autoplay: 1,
                  enablejsapi: 1,
                  iv_load_policy: 3,
                  disablekb: 1,
                  cc_load_policy: 0,
                  modestbranding: 1,
                  showinfo: 0,
                },
              }}
              className="w-full h-full"
              onReady={(event) => {
                playerRef.current = event.target
              }}
              onError={(e) => console.error('YouTube Error:', e)}
            />
          </div>
        </div>

        <div className={cn(
          'absolute top-0 h-full bg-black/50 backdrop-blur-md transition-all duration-300 ease-in-out z-10',
          isCarouselVisible ? 'left-0' : 'md:-left-[180px] -left-[70px]',
          'w-[100px] md:w-[200px]'
        )}>
          <button 
            onClick={() => setIsCarouselVisible(!isCarouselVisible)}
            className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-12 flex items-center justify-center bg-black/50 text-white/60 hover:text-white/90 transition-colors rounded-r-md z-10"
          >
            {isCarouselVisible ? (
              <ChevronLeft className="w-6 h-6" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </button>
          <div className="relative h-full rounded-md overflow-hidden touch-pan-y">
            <div 
              ref={carouselRef}
              className="absolute inset-0 overflow-y-auto scrollbar-none touch-pan-y overscroll-contain"
              onScroll={(e) => {
                const target = e.currentTarget
                setShowLeftArrow(target.scrollTop > 0)
                setShowRightArrow(
                  target.scrollTop < target.scrollHeight - target.clientHeight ||
                  videos.indexOf(video) < videos.length - 1
                )
              }}
            >
              <div className="flex flex-col min-h-max py-2">
                {videos.map((v, index) => (
                  <button
                    key={`${v.id}-${v.startTime}`}
                    data-video-id={`${v.id}-${v.startTime}`}
                    onClick={() => handleChapterClick(v)}
                    className={cn(
                      'w-full py-1 px-4 text-left transition-all duration-300 hover:bg-white/10',
                      v.id === video.id && video.startTime === v.startTime
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white'
                    )}
                  >
                    <span className="text-xs leading-none font-small">{v.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
