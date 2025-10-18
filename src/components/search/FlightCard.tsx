import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flight, Seller, FlightSegment } from "@/lib/types";
import {
  formatCurrency,
  formatMiles,
  formatTime,
  formatDate,
  getSellerLevelColor,
  calculateMileValue,
} from "@/lib/utils";
import {
  ChevronDown,
  Phone,
  Mail,
  MessageCircle,
  User,
  BadgeCheck,
  Shield,
  Clock,
  MapPin,
  PlaneIcon,
  RefreshCw,
  Luggage,
  PlaneTakeoff,
  PlaneLanding,
  Shuffle,
  Sparkles,
  TrendingDown,
  Zap,
  Crown,
  AlertTriangle,
  TrendingUp,
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
  const [expandedItinerary, setExpandedItinerary] = useState(false);

  const toggleSeller = (sellerId: string) => {
    setExpandedSeller(expandedSeller === sellerId ? null : sellerId);
  };

  const toggleItinerary = () => {
    setExpandedItinerary(!expandedItinerary);
  };

  // Cálculo do valor das milhas
  const mileCalculation = useMemo(() => {
    return calculateMileValue(flight.milesPrice, flight.program);
  }, [flight.milesPrice, flight.program]);

  // Determina se é uma oferta premium baseada no desconto
  const isPremiumOffer = mileCalculation.discountPercentage >= 30;
  const isGoodOffer = mileCalculation.discountPercentage >= 15;

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

  const getMileValueColor = (discount: number) => {
    if (discount >= 30)
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (discount >= 15) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getMileValueIcon = (discount: number) => {
    if (discount >= 30) return <Crown className="w-4 h-4" />;
    if (discount >= 15) return <Zap className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const formatSegmentDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  };

  const calculateLayoverTime = (
    currentArrival: string,
    nextDeparture: string
  ): number => {
    const arrival = new Date(currentArrival);
    const departure = new Date(nextDeparture);
    const diffMs = departure.getTime() - arrival.getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  const getStopsText = () => {
    const stops = flight.stopOvers || 0;

    if (stops == 0) {
      return "Voo Direto";
    }

    return `${stops} ${stops === 1 ? "Parada" : "Paradas"}`;
  };

  const getStopsCount = () => {
    return flight.itinerary ? flight.itinerary.length - 1 : 0;
  };

  // SELEÇÃO GARANTIDA DE VENDEDORES - VERSÃO SIMPLES E ROBUSTA
  const flightSellers = useMemo((): Seller[] => {
    // Garante que sempre tenha pelo menos 1 vendedor
    if (!sellers || sellers.length === 0) {
      console.warn("⚠️ Nenhum vendedor disponível");
      return [];
    }

    const minSellers = 1;
    const maxSellers = 3;

    // Usa o ID do voo como seed para consistência
    const flightId = flight.id || `flight-${Date.now()}`;
    const seed = flightId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Calcula quantos vendedores este voo terá (1-3)
    const sellerCount = minSellers + (seed % (maxSellers - minSellers + 1));

    console.log(
      `✈️ Voo ${flightId} terá ${sellerCount} vendedor(es) de ${sellers.length} disponíveis`
    );

    // Seleciona vendedores aleatórios da lista disponível
    const selectedSellers: Seller[] = [];
    const availableSellers = [...sellers]; // Cria uma cópia para não modificar o original

    for (let i = 0; i < sellerCount && availableSellers.length > 0; i++) {
      // Usa o seed + i para seleção determinística mas variada
      const randomIndex = (seed + i) % availableSellers.length;
      selectedSellers.push(availableSellers[randomIndex]);

      // Remove o seller selecionado para evitar duplicatas no mesmo voo
      availableSellers.splice(randomIndex, 1);
    }

    // Fallback absoluto - se ainda não tiver sellers, pega os primeiros
    if (selectedSellers.length === 0 && sellers.length > 0) {
      selectedSellers.push(sellers[0]);
    }

    console.log(
      `✅ Voo ${flightId}: ${selectedSellers.length} vendedor(es) selecionado(s)`,
      selectedSellers.map((s) => s.name)
    );

    return selectedSellers;
  }, [flight.id, sellers]);

  // Render da timeline moderna do itinerário
  const renderTimeline = () => {
    if (!flight.itinerary || flight.itinerary.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 mb-4 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h5 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-[#317873]" />
            Itinerário de voo ({getStopsCount()} parada
            {getStopsCount() !== 1 ? "s" : ""})
          </h5>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded">
            <Clock className="w-4 h-4" />
            <span>Duração total: {flight.duration}</span>
          </div>
        </div>

        <div className="relative">
          <div className="space-y-2">
            {flight.itinerary.map((segment: FlightSegment, index: number) => (
              <div key={index} className="relative">
                {/* Container Principal do Segmento */}
                <div className="relative">
                  {/* Segmento de Voo - Partida */}
                  <div className="relative z-10 flex gap-6 mb-2">
                    {/* Ícone de Partida */}
                    <div className="flex items-center justify-center flex-shrink-0 relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <PlaneTakeoff className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Informações de Partida */}
                    <div className="flex-1 bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <div className="text-xl font-bold text-gray-900">
                              {formatTime(segment.departure)}
                            </div>
                            <div className="text-xl font text-[#317873]">
                              {segment.origin}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-sm">{flight.originCity}</span>
                            {segment.flight.departureTerminal && (
                              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border">
                                Terminal {segment.flight.departureTerminal}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Informações do Voo */}
                        <div className="text-right">
                          <div className="font-mono text-sm font-bold text-gray-900 mb-1">
                            {segment.flight.airlineCode}
                            {segment.flight.flightNumber}
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {segment.aircraftLeaseText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Linha de Conexão entre Partida e Chegada */}
                  <div className="relative z-0 flex gap-6 mb-2">
                    <div className="flex-shrink-0 w-10 flex justify-center">
                      <div className="w-1 h-12 relative">
                        {/* Efeito gradiente - transparente nas bordas, forte no centro */}
                        <div className="absolute inset-0 bg-gradient-to-b from-green-400/30 via-green-500/80 to-blue-400/30 rounded-full">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent opacity-50" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center">
                      <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded border border-blue-200 w-full">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-blue-700">
                            Tempo de voo:{" "}
                            {formatSegmentDuration(segment.duration)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Segmento de Voo - Chegada */}
                  <div className="relative z-10 flex gap-6">
                    {/* Ícone de Chegada */}
                    <div className="flex items-center justify-center flex-shrink-0 relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <PlaneLanding className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Informações de Chegada */}
                    <div className="flex-1 bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex flex-row gap-2">
                            <div className="text-xl font-bold text-gray-900">
                              {formatTime(segment.arrival)}
                            </div>
                            <div className="text-xl text-blue-500">
                              {segment.destination}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-sm">
                              {flight.destinationCity}
                            </span>
                            {segment.flight.arrivalTerminal && (
                              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border">
                                Terminal {segment.flight.arrivalTerminal}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-semibold text-blue-700 mb-1">
                            Chegada
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {new Date(segment.arrival).toLocaleDateString(
                              "pt-BR",
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conexão (se não for o último segmento) */}
                  {index < flight.itinerary!.length - 1 && (
                    <div className="relative z-10 flex gap-6 mt-4">
                      {/* Linha de Conexão entre Segmentos */}

                      {/* Ícone da Conexão */}
                      <div className="flex items-center justify-center flex-shrink-0 relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <RefreshCw className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Informações da Conexão */}
                      <div className="flex-1 bg-amber-50 p-5 border border-amber-200 shadow-sm rounded-2xl transition-all hover:shadow-md">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center text-amber-800 font-poppins">
                          {/* Local da Conexão */}
                          <div className="flex items-start lg:items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
                              <Shuffle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">
                                Conexão em{" "}
                                <span className="text-amber-700">
                                  {segment.destination}
                                </span>
                              </div>
                              <div className="text-xs text-amber-600 mt-1">
                                Troca de aeronave • Embarque no próximo voo
                              </div>
                            </div>
                          </div>

                          {/* Tempo de Espera */}
                          <div className="flex justify-center">
                            <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-300 shadow-sm">
                              <Clock className="w-4 h-4 text-amber-600" />
                              <div className="text-center">
                                <div className="font-semibold text-sm text-amber-800">
                                  {formatSegmentDuration(
                                    calculateLayoverTime(
                                      segment.arrival,
                                      flight.itinerary![index + 1].departure
                                    )
                                  )}
                                </div>
                                <div className="text-xs text-amber-600 font-medium">
                                  Tempo de espera
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Próximo Voo */}
                          <div className="flex items-start lg:items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
                              <PlaneIcon className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">
                                {
                                  flight.itinerary![index + 1].flight
                                    .airlineCode
                                }
                                {
                                  flight.itinerary![index + 1].flight
                                    .flightNumber
                                }
                              </div>
                              <div className="text-xs text-amber-700 mt-1">
                                Embarque:{" "}
                                <span className="font-medium text-amber-800">
                                  {formatTime(
                                    flight.itinerary![index + 1].departure
                                  )}
                                </span>
                              </div>
                              <div className="text-xs text-amber-600 mt-1">
                                {flight.itinerary![index + 1].origin} →{" "}
                                {flight.itinerary![index + 1].destination}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo do Itinerário */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Segmentos", value: flight.itinerary.length },
              { label: "Duração total", value: flight.duration },
              { label: "Operadora", value: flight.airline },
              { label: "Classe", value: flight.class },
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="text-lg font-bold text-[#317873]">
                  {item.value}
                </div>
                <div className="text-xs text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // Componente de contato
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
      className="p-4 hover:bg-white transition-all duration-300 border-b border-gray-100/50 last:border-b-0 bg-gray-50/30"
    >
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Informações do Voo */}
        <div className="flex-1">
          {/* Container Principal com Borda Única */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Header do Voo */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Informações da Companhia */}
                <div className="flex items-start gap-4 flex-1">
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
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-bold text-gray-900 text-xl font-poppins">
                        {flight.airline}
                      </h4>
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getProgramColor(
                          flight.program
                        )}`}
                      >
                        {flight.program === "latam"
                          ? "LATAM Pass"
                          : flight.program === "gol"
                          ? "Smiles"
                          : "TudoAzul"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                        Voo {flight.flightNumber}
                      </span>
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200">
                        {flight.class}
                      </span>
                      {flight.brands?.[0] && (
                        <span className="flex items-center gap-1 text-sm text-gray-600 bg-white px-3 py-1.5 rounded-full border">
                          <Luggage className="w-4 h-4" />
                          Bagagem:{" "}
                          {flight.brands[0].cabin.id === "Y"
                            ? "1+1"
                            : "Incluída"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-4 min-w-[300px]"
                >
                  {/* Badge de Oferta Exclusiva */}
                  {isPremiumOffer && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                    >
                      <Crown className="w-4 h-4" />
                      <span>OFERTA EXCLUSIVA</span>
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  )}

                  {/* Nosso Preço - DESTAQUE PRINCIPAL */}
                  {flight.milesPrice > 0 && (
                    <div className="text-center space-y-3 p-4 bg-gradient-to-br from-white to-emerald-50 rounded-2xl border-2 border-emerald-200 shadow-lg">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-semibold text-emerald-700">
                          Com milhas:
                        </span>
                        {isGoodOffer && !isPremiumOffer && (
                          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                            <Zap className="w-3 h-3" />
                            <span>BOA OFERTA</span>
                          </div>
                        )}
                      </div>

                      <div className="text-4xl font-bold text-emerald-700 font-poppins">
                        {formatMiles(flight.milesPrice)}
                        <span className="text-lg font-normal text-emerald-600 ml-1">
                          milhas
                        </span>
                      </div>

                      {/* Valor Calculado em Reais */}
                      {mileCalculation && (
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(mileCalculation.calculatedValue)}
                          </div>
                          <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-semibold">
                            <TrendingUp className="w-4 h-4" />
                            Melhor custo-benefício
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comparação de Valores - Design Aprimorado */}
                  <div className="grid gap-3">
                    {/* Valor Original da Companhia - DESIGN NEGATIVO */}
                    {flight.cashPrice > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative p-4 rounded-xl border border-gray-300 bg-white shadow-sm"
                      >
                        {/* Header da Companhia */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <PlaneIcon className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-sm text-gray-700">
                              Direto na companhia
                            </span>
                          </div>
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </div>

                        {/* Preço da Companhia com Efeito de Cortado */}
                        <div className="text-center relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-red-400 transform rotate-[-3deg] shadow-sm"></div>
                          </div>
                          <div className="text-2xl font-bold text-gray-400 relative">
                            {formatCurrency(flight.cashPrice)}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 text-center mt-2">
                          Preço oficial sem benefícios
                        </div>
                      </motion.div>
                    )}

                    {/* Economia Destaque - DESIGN POSITIVO */}
                    {flight.milesPrice > 0 &&
                      mileCalculation &&
                      mileCalculation.discountPercentage > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold">
                                Você economiza
                              </div>
                              <div className="text-xs opacity-90">
                                Em relação à companhia
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {mileCalculation.discountPercentage}%
                            </div>
                            <div className="text-sm font-semibold">
                              {formatCurrency(
                                flight.cashPrice -
                                  mileCalculation.calculatedValue
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Separador suave entre header e informações do voo */}
            <div className="px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>

            {/* Informações do Voo */}
            <div className="p-6">
              {/* Informações Principais do Voo */}
              <div className="flex items-center justify-between font-poppins">
                {/* Origem */}
                <div className="text-center flex-1">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {flight.departureTime || formatTime(flight.departure)}
                    </div>
                    <div className="text-2xl font text-[#317873]">
                      {flight.origin}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {flight.originCity}
                  </div>
                </div>

                {/* Linha Conectora */}
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="h-0.5 bg-gray-300 flex-1"></div>
                </div>

                {/* Duração */}
                <div className="text-center flex-1">
                  <div className="text-sm text-gray-600">Duração</div>
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <span className="font-semibold text-base">
                      {flight.duration}
                    </span>
                  </div>
                </div>

                {/* Linha Conectora */}
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="h-0.5 bg-gray-300 flex-1"></div>
                </div>

                {/* Destino */}
                <div className="text-center flex-1">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {flight.arrivalTime || formatTime(flight.arrival)}
                    </div>
                    <div className="text-2xl text-[#317873]">
                      {flight.destination}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {flight.destinationCity}
                  </div>
                </div>
              </div>

              {/* Informações Secundárias */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  {/* Tipo de Voo - Alinhado à Esquerda */}
                  <div className="flex items-center gap-6">
                    {flight.stopOvers == 0 ? (
                      <div className="text-sm text-[#317873] font-medium hover:text-[#49796b] transition-colors flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl">
                        Direto
                      </div>
                    ) : (
                      <motion.button
                        onClick={toggleItinerary}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm text-[#317873] font-medium hover:text-[#49796b] transition-colors flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl"
                      >
                        <span>{getStopsText()}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedItinerary ? "rotate-180" : ""
                          }`}
                        />
                      </motion.button>
                    )}
                  </div>

                  {/* Operadora - Alinhado à Direita */}
                  <div className="text-md text-gray-700 font-poppins">
                    Operado pela{" "}
                    <span className="font-bold text-gray-900">
                      {flight.airline}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerário Expandido - Dentro da mesma borda */}
            <AnimatePresence>
              {expandedItinerary && (
                <>
                  {/* Separador suave entre informações do voo e itinerário expandido */}
                  <div className="px-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                  </div>

                  <div className="p-6">{renderTimeline()}</div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Vendedores - Sidebar - AGORA GARANTIDO PARA TODOS OS VOOS */}
        {flightSellers.length > 0 && (
          <div className="xl:w-96 xl:border-l xl:border-l-gray-200 xl:pl-8">
            <div className="mb-6">
              <h5 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-3">
                <div className="p-2 bg-[#317873] rounded-xl">
                  <User className="w-5 h-5 text-white" />
                </div>
                Vendedores Verificados
                <span className="text-sm text-gray-500 font-normal">
                  ({flightSellers.length})
                </span>
              </h5>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Transações 100% seguras
              </p>
            </div>

            {/* Fallback absoluto - se não houver sellers, usa os primeiros disponíveis */}
            {flightSellers.length === 0 && sellers && sellers.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  ⚠️ Selecionando vendedores disponíveis...
                </p>
              </div>
            )}

            <div className="space-y-4">
              {(flightSellers.length > 0
                ? flightSellers
                : sellers?.slice(0, 2) || []
              ).map((seller, index) => (
                <motion.div
                  key={`${seller.id}-${flight.id}-${index}`}
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

                  {/* Detalhes Expandidos do Vendedor */}
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
        )}
      </div>
    </motion.div>
  );
}
