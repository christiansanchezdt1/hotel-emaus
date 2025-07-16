import { HotelSlider } from "@/components/hotel-slider"
import { HabitacionesDisponibles } from "@/components/habitaciones-disponibles"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Users, Star, Wifi, Coffee, Shield, MessageCircle, Instagram, Calendar, Award, Heart } from 'lucide-react'

export default function HomePage() {
  const whatsappUrl = "https://wa.me/5493875505939?text=Hola! Me gustaría consultar sobre disponibilidad y precios. ¿Podrían ayudarme?"
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Hotel Casa de Emaús</h1>
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
              <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              ⭐ Hotel Recomendado en Salta
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenido a
              <span className="block text-blue-600">Hotel Casa de Emaús</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Tu hogar en el corazón de Salta Capital. Comodidad, calidez y la mejor ubicación 
              para explorar nuestra hermosa ciudad.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                <a href="#habitaciones">
                  <Calendar className="h-5 w-5 mr-2" />
                  Ver Habitaciones
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-lg">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Consultar Ahora
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-600">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">4.8</div>
                <div className="text-gray-600">Calificación promedio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Centro de la ciudad</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Atención al huésped</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Slider */}
      <HotelSlider />

      {/* Services Section */}
      <section id="servicios" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para una estadía perfecta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">WiFi Gratuito</h3>
              <p className="text-gray-600 text-sm">Internet de alta velocidad en todas las áreas</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Desayuno Incluido</h3>
              <p className="text-gray-600 text-sm">Desayuno continental completo</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Seguridad 24hs</h3>
              <p className="text-gray-600 text-sm">Vigilancia y seguridad las 24 horas</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ubicación Central</h3>
              <p className="text-gray-600 text-sm">En el corazón de Salta Capital</p>
            </div>
          </div>
        </div>
      </section>

      {/* Habitaciones Section */}
      <section id="habitaciones">
        <HabitacionesDisponibles />
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contacto
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos por cualquier consulta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Información de Contacto
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Dirección</h4>
                      <p className="text-gray-600">Calle Córdoba 758, Salta Capital, CP 4400</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">WhatsApp</h4>
                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                      >
                        +54 387 550-5939
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <a 
                        href="mailto:hotelcasadeemaus@gmail.com"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        hotelcasadeemaus@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Instagram className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Instagram</h4>
                      <a 
                        href="https://instagram.com/hotelemaus_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700"
                      >
                        @hotelemaus_
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Horarios de Atención
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span className="font-medium">14:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span className="font-medium">08:00 - 11:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recepción:</span>
                    <span className="font-medium">24 horas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Acciones Rápidas
              </h3>
              
              <div className="grid gap-4">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 justify-start h-16">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-6 w-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Consultar por WhatsApp</div>
                      <div className="text-sm opacity-90">Respuesta inmediata</div>
                    </div>
                  </a>
                </Button>

                <Button asChild variant="outline" size="lg" className="justify-start h-16">
                  <a href="mailto:hotelcasadeemaus@gmail.com">
                    <Mail className="h-6 w-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Enviar Email</div>
                      <div className="text-sm text-gray-600">Para consultas detalladas</div>
                    </div>
                  </a>
                </Button>

                <Button asChild variant="outline" size="lg" className="justify-start h-16">
                  <a href="https://instagram.com/hotelemaus_" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-6 w-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Síguenos en Instagram</div>
                      <div className="text-sm text-gray-600">@hotelemaus_</div>
                    </div>
                  </a>
                </Button>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <div className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ¿Por qué elegirnos?
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Ubicación privilegiada en el centro</li>
                      <li>• Atención familiar y personalizada</li>
                      <li>• Excelente relación calidad-precio</li>
                      <li>• Desayuno casero incluido</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Hotel Casa de Emaús</h3>
                  <p className="text-gray-400 text-sm">Tu hogar en Salta</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Brindamos hospitalidad con calidez humana en el corazón de Salta Capital desde hace más de 15 años.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#habitaciones" className="hover:text-white transition-colors">Habitaciones</a></li>
                <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
                <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Calle Córdoba 758</p>
                <p>Salta Capital, CP 4400</p>
                <p>WhatsApp: +54 387 550-5939</p>
                <p>Email: hotelcasadeemaus@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 Hotel Casa de Emaús. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://instagram.com/hotelemaus_" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href={whatsappUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <div className="flex items-center gap-1 text-gray-400">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-xs">Hecho con amor en Salta</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
