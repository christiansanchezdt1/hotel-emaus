"use client"

import HotelSlider from "@/components/hotel-slider"
import HabitacionesDisponibles from "@/components/habitaciones-disponibles"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wifi,
  Car,
  Coffee,
  Shield,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Star,
  MessageCircle,
  Calendar,
  Utensils,
  Bed,
} from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Screen Slider */}
      <section className="relative">
        <HotelSlider />
      </section>

      {/* Quick Info Bar */}
      <section className="bg-amber-600 text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-medium">
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4" />
              <span>WiFi Gratuito</span>
            </div>
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4" />
              <span>Estacionamiento</span>
            </div>
            <div className="flex items-center space-x-2">
              <Coffee className="w-4 h-4" />
              <span>Desayuno Incluido</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Recepción 24hs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Seguridad</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-amber-600">25+</div>
                <div className="text-sm text-gray-600">Habitaciones</div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-amber-600">12</div>
                <div className="text-sm text-gray-600">Años de experiencia</div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-amber-600">24/7</div>
                <div className="text-sm text-gray-600">Atención</div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-amber-600">100%</div>
                <div className="text-sm text-gray-600">Satisfacción</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className="bg-amber-100 text-amber-800 px-4 py-2">Nuestra Historia</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Más de 12 años de hospitalidad familiar
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Desde 1985, Hotel Emaús ha sido sinónimo de calidez, confort y hospitalidad auténtica. Ubicado en el
                  corazón de la ciudad, ofrecemos a nuestros huéspedes una experiencia única que combina la tradición
                  familiar con las comodidades modernas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">Atención Personalizada</span>
                  </div>
                  <p className="text-sm text-gray-600">Cada huésped recibe un trato familiar y personalizado.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">Ubicación Céntrica</span>
                  </div>
                  <p className="text-sm text-gray-600">En el corazón de la ciudad, cerca de todo lo importante.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">Calidad Garantizada</span>
                  </div>
                  <p className="text-sm text-gray-600">Habitaciones cómodas con todas las amenidades.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Utensils className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">Cocina Casera</span>
                  </div>
                  <p className="text-sm text-gray-600">Desayunos caseros con productos locales frescos.</p>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8"
                onClick={() => document.getElementById("habitaciones")?.scrollIntoView({ behavior: "smooth" })}
              >
                Conocer Habitaciones
              </Button>
            </div>

            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hotel/lobby.jpg"
                  alt="Lobby Hotel Emaús"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Bed className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">25+</div>
                    <div className="text-sm text-gray-600">Habitaciones disponibles</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-6 border">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.8</div>
                    <div className="text-sm text-gray-600">Calificación promedio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-amber-100 text-amber-800 px-4 py-2">Nuestros Servicios</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Todo lo que necesitas para una estadía perfecta
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios diseñados para hacer de tu estadía una experiencia memorable y
              confortable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Wifi className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">WiFi Gratuito</h3>
                <p className="text-gray-600">Conexión de alta velocidad en todas las habitaciones y áreas comunes.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Estacionamiento</h3>
                <p className="text-gray-600">Estacionamiento seguro y gratuito para todos nuestros huéspedes.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-amber-50 to-amber-100 border-0">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Desayuno Incluido</h3>
                <p className="text-gray-600">Desayuno casero completo con productos locales frescos.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Recepción 24hs</h3>
                <p className="text-gray-600">Atención personalizada las 24 horas del día, los 365 días del año.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-red-50 to-red-100 border-0">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Seguridad</h3>
                <p className="text-gray-600">
                  Sistema de seguridad completo para tu tranquilidad y la de tus pertenencias.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-indigo-50 to-indigo-100 border-0">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Atención Familiar</h3>
                <p className="text-gray-600">Trato personalizado y familiar que hace sentir como en casa.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Habitaciones Section */}
      <section id="habitaciones" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <HabitacionesDisponibles />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-amber-100 text-amber-800 px-4 py-2">Contacto</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">¿Listo para tu próxima estadía?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos por el medio que prefieras y te responderemos a la brevedad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">WhatsApp</h3>
                  <p className="text-gray-600">Respuesta inmediata</p>
                  <p className="text-sm text-gray-500">+54 9 3875505939</p>
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={() =>
                    window.open(
                      "https://wa.me/5493814123456?text=" +
                        encodeURIComponent("Hola! Me gustaría consultar sobre disponibilidad y precios."),
                      "_blank",
                    )
                  }
                >
                  Escribir por WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Teléfono</h3>
                  <p className="text-gray-600">Llamada directa</p>
                  <p className="text-sm text-gray-500">+543875505939</p>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={() => window.open("tel:+5493814123456")}
                >
                  Llamar Ahora
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">Consulta detallada</p>
                  <p className="text-sm text-gray-500">hotelcasadeemaus@gmail.com</p>
                </div>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  onClick={() => window.open("mailto:hotelcasadeemaus@gmail.com?subject=Consulta de Reserva")}
                >
                  Enviar Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Location Info */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <MapPin className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Nuestra Ubicación</h3>
                </div>
                <p className="text-gray-600 mb-2">Córdoba 758 - Salta Capital - Argentina - CP. 4400</p>
                <p className="text-gray-600 mb-4">Salta, Argentina</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Check-in: 14:00</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Check-out: 11:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Hotel Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-400">Hotel Emaús</h3>
              <p className="text-gray-300 leading-relaxed">
                Más de 12 años ofreciendo hospitalidad familiar en el corazón de Tucumán. Tu hogar lejos de casa.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">3.8/5</div>
                  <div className="text-sm text-gray-400">Calificación promedio</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-amber-400">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button
                    onClick={() => document.getElementById("habitaciones")?.scrollIntoView({ behavior: "smooth" })}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Habitaciones
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Contacto
                  </button>
                </li>
                <li>
                  <a href="/admin/login" className="hover:text-amber-400 transition-colors">
                    Administración
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-amber-400">Servicios</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4" />
                  <span>WiFi Gratuito</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Car className="w-4 h-4" />
                  <span>Estacionamiento</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coffee className="w-4 h-4" />
                  <span>Desayuno Incluido</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Recepción 24hs</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-amber-400">Contacto</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">
                    Córdoba 758 - Salta Capital - Argentina - CP. 4400
                    <br />
                    Salta
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">+54 381 412-3456</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">info@hotelemaus.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-amber-400" />
                  <button
                    onClick={() =>
                      window.open(
                        "https://wa.me/5493875505939?text=" +
                          encodeURIComponent("Hola! Me gustaría consultar sobre disponibilidad."),
                        "_blank",
                      )
                    }
                    className="text-sm hover:text-amber-400 transition-colors"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Hotel Emaús. Todos los derechos reservados.</p>
            <p className="text-sm mt-2">Desarrollado con ❤️ para brindar la mejor experiencia de hospitalidad.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
