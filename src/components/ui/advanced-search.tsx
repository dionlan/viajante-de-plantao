"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plane, Users, Calendar, MapPin, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./button";
import Select from "./select";
import DatePicker from "./date-picker";

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
  className?: string;
}

export interface SearchFilters {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
  tripType: "oneway" | "roundtrip";
  class: string;
  airlines: string[];
}

export default function AdvancedSearch({
  onSearch,
  loading = false,
  className,
}: AdvancedSearchProps) {
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("roundtrip");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    origin: "",
    destination: "",
    departureDate: new Date(),
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
    passengers: 1,
    tripType: "roundtrip",
    class: "economy",
    airlines: [],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const swapLocations = () => {
    setFilters((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const passengerOptions = [
    { value: "1", label: "1 passageiro" },
    { value: "2", label: "2 passageiros" },
    { value: "3", label: "3 passageiros" },
    { value: "4", label: "4 passageiros" },
    { value: "5", label: "5 passageiros" },
    { value: "6", label: "6 passageiros" },
  ];

  const classOptions = [
    { value: "economy", label: "Econômica" },
    { value: "premium_economy", label: "Econômica Premium" },
    { value: "business", label: "Executiva" },
    { value: "first", label: "Primeira Classe" },
  ];

  const airlineOptions = [
    { value: "latam", label: "LATAM" },
    { value: "gol", label: "GOL" },
    { value: "azul", label: "Azul" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white rounded-2xl shadow-2xl p-6", className)}
    >
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Trip Type Tabs */}
        <div className="flex space-x-2">
          {[
            { id: "roundtrip", label: "Ida e Volta" },
            { id: "oneway", label: "Somente Ida" },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                setTripType(type.id as "oneway" | "roundtrip");
                setFilters((prev) => ({
                  ...prev,
                  tripType: type.id as "oneway" | "roundtrip",
                }));
              }}
              className={cn(
                "px-4 py-2 rounded-full font-semibold transition-all duration-200",
                tripType === type.id
                  ? "bg-[#317873] text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Origin */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origem
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cidade ou aeroporto"
                value={filters.origin}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, origin: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#317873] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-end justify-center">
            <motion.button
              type="button"
              onClick={swapLocations}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-[#a0d6b4] rounded-full flex items-center justify-center text-white hover:bg-[#317873] transition-colors mb-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </motion.button>
          </div>

          {/* Destination */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destino
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cidade ou aeroporto"
                value={filters.destination}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#317873] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Dates and Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Departure Date */}
          <DatePicker
            label="Data de Ida"
            value={filters.departureDate}
            onChange={(date) =>
              setFilters((prev) => ({ ...prev, departureDate: date }))
            }
            minDate={new Date()}
          />

          {/* Return Date */}
          {tripType === "roundtrip" && (
            <DatePicker
              label="Data de Volta"
              value={filters.returnDate}
              onChange={(date) =>
                setFilters((prev) => ({ ...prev, returnDate: date }))
              }
              minDate={filters.departureDate}
            />
          )}

          {/* Passengers */}
          <Select
            label="Passageiros"
            options={passengerOptions}
            value={filters.passengers.toString()}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, passengers: parseInt(value) }))
            }
          />

          {/* Class */}
          <Select
            label="Classe"
            options={classOptions}
            value={filters.class}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, class: value }))
            }
          />
        </div>

        {/* Advanced Filters Toggle */}
        <motion.button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-[#317873] hover:text-[#49796b] transition-colors"
          whileHover={{ x: 5 }}
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filtros avançados</span>
          <motion.span
            animate={{ rotate: showAdvanced ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </motion.button>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <Select
                label="Companhias Aéreas"
                options={airlineOptions}
                value={filters.airlines[0] || ""}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, airlines: [value] }))
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Máximo (R$)
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#317873]"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>R$ 0</span>
                  <span>R$ 5.000</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Button */}
        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
          icon={<Search className="w-5 h-5" />}
          className="bg-gradient-to-r from-[#317873] to-[#49796b] hover:from-[#49796b] hover:to-[#317873]"
        >
          {loading ? "Buscando voos..." : "Buscar Passagens"}
        </Button>
      </form>
    </motion.div>
  );
}
