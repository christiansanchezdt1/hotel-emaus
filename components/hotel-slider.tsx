"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { Button } from "@/components/ui/button"

const hotelImages = [
  {
    src: "/images/hotel/fachada.jpg",
    alt: "Fachada del Hotel Casa de Emaús",
    title: "Fachada Principal",
    description: "Ubicado en el corazón de Salta Capital"
  },
  {
    src: "/images/hotel/lobby.jpg", 
    alt: "Lobby del Hotel Casa de Emaús",
    title: "Lobby de Recepción",
    description: "Ambiente acogedor y moderno"
  },
  {
    src: "/images/hotel/recepcion.jpg",
    alt: "Recepción del Hotel Casa de Emaús", 
    title: "Área de Recepción",
    description: "Atención personalizada las 24 horas"
  },
  {
    src: "/images/hotel/comedor-1.jpg",
    alt: "Comedor principal del Hotel Casa de Emaús",
    title: "Comedor Principal", 
    description: "Espacio amplio para desayunos y cenas"
  },
  {
    src: "/images/hotel/comedor-2.jpg",
    alt: "Área de desayuno del Hotel Casa de Emaús",
    title: "Área de Desayuno",
    description: "Desayuno continental incluido"
  },
  {
    src: "/images/hotel/comedor-3.jpg",
    alt: "Salón comedor del Hotel Casa de Emaús", 
    title: "Salón Comedor",
    description: "Ambiente familiar y confortable"
  },
  {
    src: "/images/hotel/jardin.jpg",
    alt: "Jardín Santa Faustina del Hotel Casa de Emaús",
    title: "Jardín Santa Faustina", 
    description: "Espacio verde para relajarse"
  }
]

export function HotelSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === hotelImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? hotelImages.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === hotelImages.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Conoce Nuestras Instalaciones
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre los espacios que hacen de Hotel Casa de Emaús tu hogar en Salta
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main slider */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {hotelImages.map((image, index) => (
                <div key={index} className="min-w-full h-full relative">
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                      <p className="text-lg opacity-90">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="secondary" 
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Play/Pause button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {hotelImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-blue-600 scale-125" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Thumbnails (desktop only) */}
          <div className="hidden lg:flex justify-center mt-8 space-x-4 overflow-x-auto pb-2">
            {hotelImages.map((image, index) => (
              <button
                key={index}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex 
                    ? "ring-2 ring-blue-600 scale-110" 
                    : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => goToSlide(index)}
              >
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
