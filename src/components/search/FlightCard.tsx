"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flight, Seller } from "@/lib/types";
import {
  formatCurrency,
  formatMiles,
  formatTime,
  formatDate,
  getSellerLevelColor,
} from "@/lib/utils";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  User,
  Calendar,
  BadgeCheck,
  Shield,
} from "lucide-react";
import StarRating from "@/components/ui/star-rating";
import Image from "next/image";
import Button from "@/components/ui/button";

interface FlightCardProps {
  flight: Flight;
  sellers: Seller[];
}

export default function FlightCard({ flight, sellers }: FlightCardProps) {
  const [expandedSeller, setExpandedSeller] = useState<string | null>(null);

  const toggleSeller = (sellerId: string) => {
    setExpandedSeller(expandedSeller === sellerId ? null : sellerId);
  };

  const getAirlineLogo = (airline: string) => {
    const logos = {
      LATAM: "/images/latam-logo.png",
      GOL: "/images/gol-logo.png",
      AZUL: "/images/azul-logo.png",
    };
    return (
      logos[airline as keyof typeof logos] || "/images/airline-default.png"
    );
  };

  const getProgramColor = (program: string) => {
    const colors = {
      latam: "bg-red-50 text-red-700 border-red-200",
      gol: "bg-orange-50 text-orange-700 border-orange-200",
      azul: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return (
      colors[program as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  const getProgramIcon = (program: string) => {
    const icons = {
      latam: "🔴",
      gol: "🟠",
      azul: "🔵",
    };
    return icons[program as keyof typeof icons] || "✈️";
  };

  const ContactButton = ({
    href,
    icon,
    children,
    className,
  }: {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <Button variant="outline" size="sm" icon={icon} className="w-full">
        {children}
      </Button>
    </a>
  );

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-8 hover:bg-white transition-all duration-300 border-b border-gray-100/50 last:border-b-0"
    >
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Informações do Voo */}
        <div className="flex-1">
          {/* Header do Voo */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-100"
              >
                <div className="relative w-10 h-10">
                  <Image
                    src={getAirlineLogo(flight.airline)}
                    alt={`Logo ${flight.airline}`}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {/*                   <h4 className="font-bold text-gray-900 text-xl font-poppins">
                    {flight.airline}
                  </h4> */}
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getProgramColor(
                      flight.program
                    )}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs">
                        {getProgramIcon(flight.program)}
                      </span>
                      {flight.program === "latam"
                        ? "LATAM Pass"
                        : flight.program === "gol"
                        ? "Smiles"
                        : "TudoAzul"}
                    </span>
                  </span>
                </div>
                <p className="text-gray-600 flex items-center gap-3 text-sm">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded-lg">
                    Voo {flight.flightNumber}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="font-semibold text-[#317873] bg-[#317873]/10 px-3 py-1 rounded-full">
                    {flight.class}
                  </span>
                </p>
              </div>
            </div>

            {/* Preço Principal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center sm:text-right"
            >
              <div className="text-md text-gray-700 font-poppins">
                A partir de{" "}
                <span className="text-xl font-bold text-[#317873]">
                  {formatMiles(flight.milesPrice)} milhas
                </span>
              </div>
              <div className="text-md text-gray-600 mt-1">
                ou{" "}
                <span className="font-bold text-[#317873]">
                  {formatCurrency(flight.cashPrice)}
                </span>{" "}
                por viajante
              </div>
            </motion.div>
          </div>

          {/* Timeline do Voo */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center font-poppins">
              {/* Origem */}
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 mb-1">
                  <span className="text-[#317873]">{flight.origin}</span>{" "}
                  <span className="font-normal text-gray-700">
                    {formatTime(flight.departure)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{flight.originCity}</div>
              </div>

              {/* Duração */}
              <div className="text-center">
                <div
                  id="ContainerFlightInfo"
                  role="presentation"
                  className="inline-flex flex-col items-center"
                >
                  <span className="text-gray-600 text-sm font-semibold tracking-wide uppercase mb-1">
                    Duração
                  </span>
                  <span className="text-gray-800 text-base font-medium">
                    {flight.duration}
                  </span>

                  {/* Alerta de troca de aeroporto (opcional) */}
                  {flight.stops > 0 && (
                    <div
                      role="alert"
                      className="mt-2 flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-300 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01M4.293 4.293a1 1 0 011.414 0L12 10.586l6.293-6.293a1 1 0 111.414 1.414L13.414 12l6.293 6.293a1 1 0 01-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 01-1.414-1.414L10.586 12 4.293 5.707a1 1 0 010-1.414z"
                        />
                      </svg>
                      <span>Troca de aeroporto</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Destino */}
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 mb-1">
                  <span className="text-[#317873]">{flight.destination}</span>{" "}
                  <span className="font-normal text-gray-700">
                    {formatTime(flight.arrival)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {flight.destinationCity}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendedores */}
        <div className="xl:w-96 xl:border-l xl:border-l-gray-200 xl:pl-8">
          <div className="mb-6">
            <h5 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-3">
              <div className="p-2 bg-[#317873] rounded-xl">
                <User className="w-5 h-5 text-white" />
              </div>
              Vendedores Verificados
              <span className="text-sm text-gray-500 font-normal">
                ({sellers.length})
              </span>
            </h5>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              Transações 100% seguras
            </p>
          </div>

          <div className="space-y-4">
            {sellers.map((seller, index) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Header do Vendedor */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleSeller(seller.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#317873] to-[#a0d6b4] rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                          {seller.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        {seller.verified && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 shadow-lg">
                            <BadgeCheck className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h6 className="font-semibold text-gray-900 truncate">
                            {seller.name}
                          </h6>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getSellerLevelColor(
                              seller.level
                            )}`}
                          >
                            {seller.level === "beginner"
                              ? "⭐ Iniciante"
                              : seller.level === "intermediate"
                              ? "⭐⭐ Intermediário"
                              : "⭐⭐⭐ Expert"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <StarRating rating={seller.rating} size="sm" />
                          <span className="text-sm text-gray-500">
                            {seller.rating.toFixed(1)} • {seller.totalSales}{" "}
                            vendas
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      animate={{
                        rotate: expandedSeller === seller.id ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-400"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>

                {/* Detalhes Expandidos */}
                <AnimatePresence>
                  {expandedSeller === seller.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-4 space-y-4">
                        {/* Estatísticas */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-[#317873] mb-1">
                              {seller.completionRate}%
                            </div>
                            <div className="text-gray-600">Conclusão</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-[#317873] mb-1">
                              {seller.responseTime}
                            </div>
                            <div className="text-gray-600">Resposta</div>
                          </div>
                        </div>

                        {/* Botões de Contato */}
                        <div className="grid grid-cols-3 gap-2">
                          <ContactButton
                            href={`https://wa.me/${seller.contact.whatsapp}`}
                            icon={<MessageCircle className="w-4 h-4" />}
                            className="!bg-green-50 !text-green-700 !border-green-200 hover:!bg-green-100"
                          >
                            WhatsApp
                          </ContactButton>

                          <ContactButton
                            href={`tel:${seller.contact.phone}`}
                            icon={<Phone className="w-4 h-4" />}
                            className="!bg-[#317873] !text-white hover:!bg-[#49796b]"
                          >
                            Ligar
                          </ContactButton>

                          <ContactButton
                            href={`mailto:${seller.contact.email}`}
                            icon={<Mail className="w-4 h-4" />}
                          >
                            E-mail
                          </ContactButton>
                        </div>

                        {/* Última Avaliação */}
                        {seller.reviews.length > 0 && (
                          <div className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <StarRating
                                rating={seller.reviews[0].rating}
                                size="sm"
                              />
                              <span className="text-sm font-medium text-gray-900">
                                {seller.reviews[0].user}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 italic">
                              &quot;{seller.reviews[0].comment}&quot;
                            </p>
                            <div className="text-xs text-gray-500 mt-2">
                              {formatDate(seller.reviews[0].date)}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
