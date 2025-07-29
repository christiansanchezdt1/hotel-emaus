"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    image: "/images/hotel/fachada.jpg",
    title: "Hotel Emaús",
    subtitle: "Bienvenidos a nuestro hogar",
    description: "Un lugar acogedor en el corazón de la ciudad, donde cada huésped es parte de nuestra familia.",
    highlight: "Tradición y hospitalidad desde 1985",
  },
  {
    id: 2,
    image: "/images/hotel/lobby.jpg",
    title: "Lobby Principal",
    subtitle: "Elegancia y confort",
    description: "Nuestro lobby combina la calidez del hogar con la elegancia de un hotel boutique.",
    highlight: "Recepción 24 horas",
  },
  {
    id: 3,
    image: "/images/hotel/recepcion.jpg",
    title: "Recepción",
    subtitle: "Atención personalizada",
    description: "Nuestro equipo está siempre disponible para hacer de su estadía una experiencia memorable.",
    highlight: "Servicio personalizado",
  },
  {
    id: 4,
    image: "/images/hotel/comedor-1.jpg",
    title: "Comedor Principal",
    subtitle: "Sabores auténticos",
    description: "Disfrute de nuestra cocina casera en un ambiente familiar y acogedor.",
    highlight: "Desayuno incluido",
  },
  {
    id: 5,
    image: "/images/hotel/comedor-2.jpg",
    title: "Salón de Desayuno",
    subtitle: "Comience bien el día",
    description: "Un desayuno completo y nutritivo para empezar cada mañana con energía.",
    highlight: "Productos locales frescos",
  },
  {
    id: 6,
    image: "/images/hotel/comedor-3.jpg",
    title: "Área Social",
    subtitle: "Momentos compartidos",
    description: "Espacios diseñados para el encuentro y la conversación entre huéspedes.",
    highlight: "Ambiente familiar",
  },
  {
    id: 7,
    image: "/images/hotel/jardin.jpg",
    title: "Jardín Interior",
    subtitle: "Tranquilidad natural",
    description: "Un oasis de paz en el centro de la ciudad, perfecto para relajarse y desconectar.",
    highlight: "Espacio verde privado",
  },
]

export default function HotelSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setProgress(0)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    setProgress(0)
  }, [])

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + 2 // Incrementa 2% cada 100ms = 5 segundos total
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, nextSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          prevSlide()
          break
        case "ArrowRight":
          nextSlide()
          break
        case " ":
          e.preventDefault()
          togglePlayPause()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [nextSlide, prevSlide, togglePlayPause])

  // Pause on hover
  const handleMouseEnter = () => setIsPlaying(false)
  const handleMouseLeave = () => setIsPlaying(true)

  return (
    <div
      className="relative h-screen w-full overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Image */}
      <div className="relative h-full w-full">
        <Image
          src={slides[currentSlide].image || "/placeholder.svg"}
          alt={slides[currentSlide].title}
          fill
          className="object-cover transition-all duration-1000 ease-in-out"
          priority
          sizes="100vw"
        />

        {/* Multiple Overlays for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-start">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <div className="space-y-6 animate-fade-in">
              {/* Highlight Badge */}
              <div className="inline-block">
                <span className="bg-amber-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {slides[currentSlide].highlight}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">{slides[currentSlide].title}</h1>

              {/* Subtitle */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-amber-100">
                {slides[currentSlide].subtitle}
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl leading-relaxed text-gray-200 max-w-xl">
                {slides[currentSlide].description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 text-lg"
                  onClick={() => document.getElementById("habitaciones")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Ver Habitaciones
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3 text-lg backdrop-blur-sm bg-transparent"
                  onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Contactar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="ghost"
          size="lg"
          onClick={prevSlide}
          className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 rounded-full p-3"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={nextSlide}
          className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 rounded-full p-3"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-0 right-0">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Slide Counter and Progress */}
            <div className="flex items-center space-x-4">
              <div className="bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                {currentSlide + 1} / {slides.length}
              </div>

              {/* Progress Bar */}
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Play/Pause Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
                className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 rounded-full p-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>

            {/* Thumbnails (Hidden on mobile) */}
            <div className="hidden lg:flex space-x-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`relative w-16 h-10 rounded overflow-hidden transition-all duration-300 ${
                    index === currentSlide
                      ? "ring-2 ring-amber-500 scale-110"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <Image
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>

            {/* Dots for mobile */}
            <div className="flex lg:hidden space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-amber-500 scale-125" : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
