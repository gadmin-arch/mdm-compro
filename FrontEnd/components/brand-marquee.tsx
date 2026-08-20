"use client"

import React, { useRef, useEffect, useState } from "react"
import { BrandLogo } from "@/components/brand-logos"

interface BrandMarqueeProps {
  brands: string[]
  className?: string
}

function MarqueeRow({
  brands,
  direction = "left",
  speed = 0.6,
}: {
  brands: string[]
  direction?: "left" | "right"
  speed?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftStart = useRef(0)
  const isHovered = useRef(false)
  const [isGrabbing, setIsGrabbing] = useState(false)

  // Quadruple items to ensure seamless infinite looping
  const items = [...brands, ...brands, ...brands, ...brands]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrameId: number

    // If direction is right, initialize at half position
    if (direction === "right" && container.scrollLeft === 0) {
      container.scrollLeft = container.scrollWidth / 2
    }

    const step = () => {
      if (container && !isDragging.current && !isHovered.current) {
        const halfWidth = container.scrollWidth / 2
        if (direction === "left") {
          container.scrollLeft += speed
          if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth
          }
        } else {
          container.scrollLeft -= speed
          if (container.scrollLeft <= 0) {
            container.scrollLeft += halfWidth
          }
        }
      }
      animationFrameId = requestAnimationFrame(step)
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [direction, speed])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    isDragging.current = true
    setIsGrabbing(true)
    startX.current = e.pageX - containerRef.current.offsetLeft
    scrollLeftStart.current = containerRef.current.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX.current) * 1.3
    containerRef.current.scrollLeft = scrollLeftStart.current - walk

    const halfWidth = containerRef.current.scrollWidth / 2
    if (containerRef.current.scrollLeft >= halfWidth) {
      containerRef.current.scrollLeft -= halfWidth
      scrollLeftStart.current -= halfWidth
    } else if (containerRef.current.scrollLeft <= 0) {
      containerRef.current.scrollLeft += halfWidth
      scrollLeftStart.current += halfWidth
    }
  }

  const handleMouseUpOrLeave = () => {
    isDragging.current = false
    setIsGrabbing(false)
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHovered.current = true
      }}
      onMouseLeave={() => {
        isHovered.current = false
        handleMouseUpOrLeave()
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      className={`flex gap-3 overflow-x-auto select-none py-1 transition-all ${
        isGrabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {items.map((brand, idx) => (
        <div
          key={`${brand}-${idx}`}
          className="group flex flex-shrink-0 items-center justify-center rounded-xl border border-border/80 bg-secondary/20 px-4 py-2 text-center transition-all hover:border-primary/50 hover:bg-card hover:shadow-xs min-w-[130px] max-w-[170px] h-[64px]"
          title={brand}
        >
          <div className="flex items-center justify-center h-8 w-full pointer-events-none">
            <BrandLogo
              brand={brand}
              className="w-auto max-w-[110px] transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function BrandMarquee({ brands, className = "" }: BrandMarqueeProps) {
  // Split brands into 2 rows evenly
  const half = Math.ceil(brands.length / 2)
  const row1 = brands.slice(0, half)
  const row2 = brands.slice(half)

  return (
    <div className={`relative w-full overflow-hidden mask-fade-x py-1 ${className}`}>
      {/* Row 1 - Slides Left & Draggable */}
      <div className="mb-3">
        <MarqueeRow brands={row1} direction="left" speed={0.6} />
      </div>

      {/* Row 2 - Slides Right & Draggable */}
      <div>
        <MarqueeRow brands={row2} direction="right" speed={0.6} />
      </div>
    </div>
  )
}
