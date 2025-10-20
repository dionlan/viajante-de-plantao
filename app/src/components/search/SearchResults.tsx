import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightCard from "./FlightCard";
import { Plane, Filter, SortAsc, SlidersHorizontal, X } from "lucide-react";
import { mockSellers } from "app/src/lib/mockData";
import { FlightSearch, Flight } from "app/src/lib/types";
import { formatDate } from "app/src/lib/utils";
import Button from "../ui/button";
import FilterDropdown from "../ui/filter-dropdown";

interface SearchResultsProps {
  searchData: FlightSearch | null;
  isLoading: boolean;
  searchResults: Flight[];
  error: string | null;
  onRetry?: () => void; // Nova prop
}

interface Filters {
  airline: string;
  stops: string;
  sortBy: string;
  priceRange: [number, number];
}

export default function SearchResults({
  searchData,
  isLoading,
  searchResults,
  error,
  onRetry, // Adicione esta prop
}: SearchResultsProps) {
  const [filters, setFilters] = useState<Filters>({
    airline: "all",
    stops: "all",
    sortBy: "miles",
    priceRange: [0, 5000],
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Usa os resultados reais da API
  const flights = searchResults;
  const sellers = mockSellers;

  // Filtros e ordenação
  const filteredAndSortedFlights = useMemo(() => {
    const filtered = flights.filter((flight) => {
      // Filtro por companhia aérea
      if (filters.airline !== "all" && flight.airline !== filters.airline) {
        return false;
      }

      // Filtro por paradas
      if (filters.stops !== "all") {
        if (filters.stops === "direct" && !flight.stopOvers) return false;
        if (filters.stops === "1" && flight.stopOvers !== 1) return false;
        if (filters.stops === "2" && flight.stopOvers < 2) return false;
      }

      // Filtro por preço
      if (
        flight.cashPrice < filters.priceRange[0] ||
        flight.cashPrice > filters.priceRange[1]
      ) {
        return false;
      }

      return true;
    });

    // Ordenação
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "miles":
          return a.milesPrice - b.milesPrice;
        case "cash":
          return a.cashPrice - b.cashPrice;
        case "duration":
          return a.duration.localeCompare(b.duration);
        case "departure":
          return (
            new Date(a.departure).getTime() - new Date(b.departure).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [flights, filters]);

  const airlineOptions = [
    { value: "all", label: "Todas", count: flights.length },
    {
      value: "LATAM",
      label: "LATAM",
      count: flights.filter((f) => f.airline === "LATAM").length,
    },
    {
      value: "GOL",
      label: "GOL",
      count: flights.filter((f) => f.airline === "GOL").length,
    },
    {
      value: "AZUL",
      label: "Azul",
      count: flights.filter((f) => f.airline === "AZUL").length,
    },
  ];

  const stopsOptions = [
    { value: "all", label: "Todas paradas", count: flights.length },
    {
      value: "direct",
      label: "Voo direto",
      count: flights.filter((f) => f.stopOvers).length,
    },
    {
      value: "1",
      label: "1 parada",
      count: flights.filter((f) => f.stopOvers === 1).length,
    },
    {
      value: "2",
      label: "2+ paradas",
      count: flights.filter((f) => f.stopOvers >= 2).length,
    },
  ];

  const sortOptions = [
    { value: "miles", label: "Menor preço em milhas" },
    { value: "cash", label: "Menor preço em R$" },
    { value: "duration", label: "Menor duração" },
    { value: "departure", label: "Horário de saída" },
  ];

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-white/20"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
          Erro na busca
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.location.reload()}>
            Recarregar Página
          </Button>
          {onRetry && ( // Agora onRetry está definido
            <Button variant="outline" onClick={onRetry}>
              Tentar Novamente
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20"
      >
        <div className="text-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-20 h-20 bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-3xl mx-auto mb-6 flex items-center justify-center"
          >
            <Plane className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3 font-poppins">
            Buscando as melhores ofertas...
          </h3>
          <p className="text-gray-600 text-lg">
            Consultando todas as companhias aéreas
          </p>
          <div className="mt-6 w-32 h-1 bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-white/30"
              animate={{ x: [-100, 100] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!searchData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-16 text-center border border-white/20"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-br from-[#317873] to-[#a0d6b4] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg"
        >
          <Plane className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-800 mb-4 font-poppins">
          Encontre sua próxima viagem
        </h3>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Preencha o formulário acima para descobrir as melhores oportunidades
          em passagens com milhas
        </p>
        <div className="w-32 h-1 bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-full mx-auto"></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
    >
      {/* Header com filtros */}
      <div className="border-b border-gray-200/50 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Informações da busca */}
          <div className="flex-1">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-900 mb-2 font-poppins"
            >
              {filteredAndSortedFlights.length} voos encontrados
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg"
            >
              {searchData.origin} → {searchData.destination} •{" "}
              {formatDate(searchData.departureDate)}
              {searchData.tripType === "roundtrip" &&
                searchData.returnDate &&
                ` • ${formatDate(searchData.returnDate)}`}
            </motion.p>
          </div>

          {/* Filtros Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <FilterDropdown
              options={airlineOptions}
              value={filters.airline}
              onValueChange={(value: string) =>
                handleFilterChange("airline", value)
              }
              placeholder="Companhia"
              icon={<Plane className="w-4 h-4" />}
            />

            <FilterDropdown
              options={stopsOptions}
              value={filters.stops}
              onValueChange={(value: string) =>
                handleFilterChange("stops", value)
              }
              placeholder="Paradas"
              icon={<SlidersHorizontal className="w-4 h-4" />}
            />

            <FilterDropdown
              options={sortOptions}
              value={filters.sortBy}
              onValueChange={(value: string) =>
                handleFilterChange("sortBy", value)
              }
              placeholder="Ordenar por"
              icon={<SortAsc className="w-4 h-4" />}
            />
          </div>

          {/* Botão Filtros Mobile */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              icon={<Filter className="w-4 h-4" />}
              onClick={() => setShowMobileFilters(true)}
            >
              Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Voos */}
      <div className="divide-y divide-gray-100/50">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedFlights.map((flight, index) => (
            <motion.div
              key={flight.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
              }}
              className="hover:bg-gray-50/50 transition-colors duration-300"
            >
              <FlightCard
                flight={flight}
                sellers={sellers.filter((seller) =>
                  flight.sellers.includes(seller.id)
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Estado vazio */}
      {filteredAndSortedFlights.length === 0 && flights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 px-8"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <Plane className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3 font-poppins">
            Nenhum voo encontrado
          </h3>
          <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
            Tente ajustar os filtros ou datas da sua busca para encontrar mais
            opções
          </p>
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                airline: "all",
                stops: "all",
                sortBy: "miles",
                priceRange: [0, 5000],
              })
            }
          >
            Limpar filtros
          </Button>
        </motion.div>
      )}

      {/* Filtros Mobile */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <FilterDropdown
                  options={airlineOptions}
                  value={filters.airline}
                  onValueChange={(value: string) =>
                    handleFilterChange("airline", value)
                  }
                  placeholder="Companhia"
                  icon={<Plane className="w-4 h-4" />}
                />

                <FilterDropdown
                  options={stopsOptions}
                  value={filters.stops}
                  onValueChange={(value: string) =>
                    handleFilterChange("stops", value)
                  }
                  placeholder="Paradas"
                  icon={<SlidersHorizontal className="w-4 h-4" />}
                />

                <FilterDropdown
                  options={sortOptions}
                  value={filters.sortBy}
                  onValueChange={(value: string) =>
                    handleFilterChange("sortBy", value)
                  }
                  placeholder="Ordenar por"
                  icon={<SortAsc className="w-4 h-4" />}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
                <Button fullWidth onClick={() => setShowMobileFilters(false)}>
                  Aplicar filtros
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
