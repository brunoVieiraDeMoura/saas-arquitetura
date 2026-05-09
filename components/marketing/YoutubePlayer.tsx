'use client'

import { useEffect, useRef } from 'react'

type YTPlayer = {
  setPlaybackQuality: (q: string) => void
  destroy: () => void
}

type YTPlayerState = { PLAYING: number }

type YTEvent = { target: YTPlayer; data?: number }

declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement, opts: object) => YTPlayer
      PlayerState: YTPlayerState
    }
    onYouTubeIframeAPIReady: () => void
  }
}

export default function YoutubePlayer({ videoId }: { videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)

  useEffect(() => {
    function initPlayer() {
      if (!containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: YTEvent) => e.target.setPlaybackQuality('hd1080'),
          onStateChange: (e: YTEvent) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              e.target.setPlaybackQuality('hd1080')
            }
          },
        },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      if (!document.getElementById('yt-api-script')) {
        const script = document.createElement('script')
        script.id = 'yt-api-script'
        script.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(script)
      }
    }

    return () => { playerRef.current?.destroy() }
  }, [videoId])

  return <div ref={containerRef} className="w-full h-full" />
}
