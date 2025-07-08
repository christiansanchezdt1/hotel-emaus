import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Wifi, Car, Coffee, Utensils, Shield, Clock, Star, Bed } from "lucide-react"
import HabitacionesDisponibles from "@/components/habitaciones-disponibles"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Hotel Emaús
                </h1>
                <p className="text-sm text-gray-600">Tu hogar lejos de casa</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Inicio
              </a>
              <a href="#servicios" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Servicios
              </a>
              <a href="#habitaciones" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Habitaciones
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                  ⭐ Hotel 4 Estrellas
                </Badge>
                <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Bienvenido al
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Hotel Emaús
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experimenta la perfecta combinación de comodidad, elegancia y hospitalidad en el corazón de la ciudad.
                  Tu refugio ideal para descansar y disfrutar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Reservar Ahora
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-xl transition-all duration-300 bg-transparent"
                >
                  Ver Habitaciones
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-sm text-gray-600">+500 huéspedes satisfechos</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Bed className="w-16 h-16 text-blue-600 mx-auto" />
                    <p className="text-gray-600">Imagen del Hotel</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  Mejor
                  <br />
                  Precio
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200 mb-4">
              Nuestros Servicios
            </Badge>
            <h3 className="text-4xl font-bold mb-4">
              Todo lo que necesitas para una
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                estadía perfecta
              </span>
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Disfruta de nuestros servicios premium diseñados para hacer tu experiencia inolvidable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Wifi,
                title: "WiFi Gratuito",
                description: "Internet de alta velocidad en todas las áreas del hotel",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Car,
                title: "Estacionamiento",
                description: "Amplio estacionamiento gratuito y seguro para nuestros huéspedes",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Coffee,
                title: "Desayuno Incluido",
                description: "Delicioso desayuno buffet incluido en tu estadía",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Utensils,
                title: "Restaurante",
                description: "Exquisita gastronomía local e internacional",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Shield,
                title: "Seguridad 24/7",
                description: "Vigilancia y seguridad las 24 horas del día",
                color: "from-indigo-500 to-blue-500",
              },
              {
                icon: Clock,
                title: "Recepción 24h",
                description: "Atención personalizada en todo momento",
                color: "from-teal-500 to-green-500",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="habitaciones" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 mb-4">
              Nuestras Habitaciones
            </Badge>
            <h3 className="text-4xl font-bold mb-4">
              Habitaciones disponibles para
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                tu estadía perfecta
              </span>
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Habitaciones disponibles para hoy. Todas nuestras habitaciones incluyen servicios premium.
            </p>
          </div>

          <HabitacionesDisponibles />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/20 mb-4">Contáctanos</Badge>
            <h3 className="text-4xl font-bold mb-4">
              ¿Listo para tu próxima
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                aventura?
              </span>
            </h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Estamos aquí para hacer tu estadía inolvidable. Contáctanos para reservas o consultas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "Ubicación",
                info: "Calle Principal #123\nCentro de la Ciudad",
                color: "from-red-400 to-pink-400",
              },
              {
                icon: Phone,
                title: "Teléfono",
                info: "+1 (555) 123-4567\nDisponible 24/7",
                color: "from-green-400 to-emerald-400",
              },
              {
                icon: Mail,
                title: "Email",
                info: "info@hotelEmaus.com\nreservas@hotelEmaus.com",
                color: "from-blue-400 to-cyan-400",
              },
            ].map((contact, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-md border-white/20 text-center hover:bg-white/20 transition-all duration-300"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center mb-4`}
                  >
                    <contact.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">{contact.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100 whitespace-pre-line">{contact.info}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Hacer Reserva
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Bed className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Hotel Emaús</h4>
                  <p className="text-sm text-gray-400">Tu hogar lejos de casa</p>
                </div>
              </div>
              <p className="text-gray-400">
                Ofrecemos la mejor experiencia de hospitalidad con servicios de calidad y atención personalizada.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-blue-400">Enlaces Rápidos</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#inicio" className="hover:text-white transition-colors">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#servicios" className="hover:text-white transition-colors">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="#habitaciones" className="hover:text-white transition-colors">
                    Habitaciones
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-blue-400">Servicios</h5>
              <ul className="space-y-2 text-gray-400">
                <li>WiFi Gratuito</li>
                <li>Estacionamiento</li>
                <li>Desayuno Incluido</li>
                <li>Restaurante</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-blue-400">Horarios</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Check-in: 3:00 PM</li>
                <li>Check-out: 12:00 PM</li>
                <li>Recepción: 24/7</li>
                <li>Restaurante: 6:00 AM - 11:00 PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Hotel Emaús. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
