"use client"

import { HabitacionesDisponibles } from "@/components/habitaciones-disponibles"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Instagram, Wifi, Car, Coffee, Shield, Clock, Calendar, Award } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Hotel Casa de Emaús</h1>
                <p className="text-sm text-gray-600">Salta Capital</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#habitaciones" className="text-gray-700 hover:text-blue-600 transition-colors">
                Habitaciones
              </a>
              <a href="#servicios" className="text-gray-700 hover:text-blue-600 transition-colors">
                Servicios
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contacto
              </a>
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                onClick={() => document.getElementById("habitaciones")?.scrollIntoView({ behavior: "smooth" })}
              >
                Reservar
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Descanso y Espiritualidad
              </span>
              <br />
              <span className="text-gray-800">en el Corazón de Salta</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Bienvenidos al Hotel Casa de Emaús, donde la hospitalidad se encuentra con la tranquilidad. Ubicado en el
              centro histórico de Salta, ofrecemos una experiencia única de descanso y paz.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-600">Habitaciones</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">5★</div>
                <div className="text-gray-600">Calificación</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Atención</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-amber-600 mb-2">Centro</div>
                <div className="text-gray-600">Ubicación</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
                onClick={() => document.getElementById("habitaciones")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Ver Habitaciones
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 text-lg bg-transparent"
                onClick={() => window.open("https://wa.me/5493875505939", "_blank")}
              >
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Nuestros Servicios
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Disfruta de todas las comodidades que tenemos para ofrecerte durante tu estadía
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">WiFi Gratuito</h3>
                <p className="text-gray-600">Internet de alta velocidad en todas las habitaciones y áreas comunes</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Estacionamiento</h3>
                <p className="text-gray-600">Estacionamiento gratuito y seguro para todos nuestros huéspedes</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Desayuno Incluido</h3>
                <p className="text-gray-600">Desayuno buffet completo incluido en todas las tarifas</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Seguridad 24/7</h3>
                <p className="text-gray-600">Seguridad y vigilancia las 24 horas para tu tranquilidad</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Recepción 24h</h3>
                <p className="text-gray-600">Atención personalizada las 24 horas del día</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ubicación Céntrica</h3>
                <p className="text-gray-600">En el corazón de Salta, cerca de todos los atractivos turísticos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Habitaciones Section */}
      <section id="habitaciones">
        <HabitacionesDisponibles />
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-16 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Contáctanos</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-300" />
                <h3 className="text-lg font-semibold mb-2">Dirección</h3>
                <p className="text-blue-100">
                  Calle Córdoba 758
                  <br />
                  Salta Capital, CP 4400
                  <br />
                  Argentina
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 mx-auto mb-4 text-green-300" />
                <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                <p className="text-blue-100 mb-3">+54 387 550-5939</p>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  onClick={() => window.open("https://wa.me/5493875505939", "_blank")}
                >
                  Enviar Mensaje
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 text-purple-300" />
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-blue-100 mb-3">hotelcasadeemaus@gmail.com</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  onClick={() => window.open("mailto:hotelcasadeemaus@gmail.com", "_blank")}
                >
                  Enviar Email
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Instagram className="h-12 w-12 mx-auto mb-4 text-pink-300" />
                <h3 className="text-lg font-semibold mb-2">Instagram</h3>
                <p className="text-blue-100 mb-3">@hotelemaus_</p>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={() => window.open("https://instagram.com/hotelemaus_", "_blank")}
                >
                  Seguir
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Hotel Casa de Emaús</h3>
                  <p className="text-gray-400">Descanso y espiritualidad en Salta</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Un lugar de paz y tranquilidad en el corazón de Salta, donde cada huésped es recibido como familia.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#habitaciones" className="text-gray-300 hover:text-white transition-colors">
                    Habitaciones
                  </a>
                </li>
                <li>
                  <a href="#servicios" className="text-gray-300 hover:text-white transition-colors">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="text-gray-300 hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="/admin" className="text-gray-300 hover:text-white transition-colors">
                    Administración
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Información de Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Calle Córdoba 758, Salta Capital</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">+54 387 550-5939</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-300">hotelcasadeemaus@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Hotel Casa de Emaús. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
