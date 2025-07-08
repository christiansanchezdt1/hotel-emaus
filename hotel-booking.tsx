"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  MapPin,
  Star,
  Wifi,
  Car,
  Dumbbell,
  UtensilsCrossed,
  Phone,
  Mail,
  Users,
  Maximize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { supabase, type Room } from "@/lib/supabase"

export default function HotelBooking() {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  const hotelImages = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ]

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      const { data: roomsData, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("is_available", true)
        .order("price", { ascending: true })

      if (error) {
        console.error("Error loading rooms:", error)
      } else {
        setRooms(roomsData || [])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotelImages.length) % hotelImages.length)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HE</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Hotel Emaus</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#inicio" className="text-gray-600 hover:text-blue-600">
                Inicio
              </a>
              <a href="#habitaciones" className="text-gray-600 hover:text-blue-600">
                Habitaciones
              </a>
              <a href="#servicios" className="text-gray-600 hover:text-blue-600">
                Servicios
              </a>
              <a href="#contacto" className="text-gray-600 hover:text-blue-600">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative h-[70vh] overflow-hidden">
        <Image src="/placeholder.svg?height=800&width=1200" alt="Hotel Emaus" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Hotel Emaus</h1>
            <p className="text-xl md:text-2xl mb-6">Tu refugio perfecto en el corazón de la ciudad</p>
            <div className="flex items-center justify-center space-x-2 mb-8">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">Av. Principal 123, Centro Histórico</span>
            </div>
            <div className="flex items-center justify-center space-x-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg">4.8 (324 reseñas)</span>
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Reservar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Galería del Hotel</h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={hotelImages[currentImageIndex] || "/placeholder.svg"}
                alt={`Hotel imagen ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              {hotelImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-blue-600" : "bg-gray-300"}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="habitaciones" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestras Habitaciones</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando habitaciones...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image src={room.image_url || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {room.name}
                      <Badge variant="secondary">${room.price}/noche</Badge>
                    </CardTitle>
                    <CardDescription>{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{room.capacity} huéspedes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Maximize className="w-4 h-4" />
                        <span>{room.size} m²</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Comodidades:</h4>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities?.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Seleccionar Habitación</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Hacer una Reserva</CardTitle>
                <CardDescription className="text-center">
                  Complete el formulario para reservar su estadía
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkin">Fecha de Entrada</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "PPP", { locale: es }) : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout">Fecha de Salida</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "PPP", { locale: es }) : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guests">Número de Huéspedes</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar huéspedes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 huésped</SelectItem>
                        <SelectItem value="2">2 huéspedes</SelectItem>
                        <SelectItem value="3">3 huéspedes</SelectItem>
                        <SelectItem value="4">4 huéspedes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-type">Tipo de Habitación</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar habitación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Habitación Estándar</SelectItem>
                        <SelectItem value="deluxe">Habitación Deluxe</SelectItem>
                        <SelectItem value="suite">Suite Presidencial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" placeholder="Su nombre completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="su@email.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+1 234 567 8900" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requests">Solicitudes Especiales</Label>
                  <Textarea id="requests" placeholder="¿Alguna solicitud especial para su estadía?" rows={3} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">Confirmar Reserva</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Servicios del Hotel</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">WiFi Gratuito</h3>
              <p className="text-gray-600 text-sm">Internet de alta velocidad en todas las áreas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Estacionamiento</h3>
              <p className="text-gray-600 text-sm">Estacionamiento gratuito para huéspedes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Gimnasio</h3>
              <p className="text-gray-600 text-sm">Centro de fitness equipado 24/7</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Restaurante</h3>
              <p className="text-gray-600 text-sm">Cocina gourmet y servicio a la habitación</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contacto</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-6">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Av. Principal 123, Centro Histórico, Ciudad</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>reservas@hotelemaus.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Horarios de Atención</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Recepción:</span>
                  <span>24 horas</span>
                </div>
                <div className="flex justify-between">
                  <span>Restaurante:</span>
                  <span>6:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Gimnasio:</span>
                  <span>24 horas</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>3:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>12:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HE</span>
                </div>
                <span className="text-xl font-bold">Hotel Emaus</span>
              </div>
              <p className="text-gray-400">
                Tu refugio perfecto en el corazón de la ciudad, donde la comodidad se encuentra con la elegancia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#inicio" className="hover:text-white">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#habitaciones" className="hover:text-white">
                    Habitaciones
                  </a>
                </li>
                <li>
                  <a href="#servicios" className="hover:text-white">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="hover:text-white">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li>WiFi Gratuito</li>
                <li>Estacionamiento</li>
                <li>Gimnasio</li>
                <li>Restaurante</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+1 (555) 123-4567</li>
                <li>reservas@hotelemaus.com</li>
                <li>Av. Principal 123</li>
                <li>Centro Histórico</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Hotel Emaus. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
