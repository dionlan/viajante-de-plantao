import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRightLeft, Sparkles, Plane } from "lucide-react";
import Select from "../ui/select";
import { cn } from "@/lib/utils";
import AdvancedDatePicker from "../ui/advanced-date-picker";
import AirportAutocomplete from "../ui/airport-autocomplete";
import Button from "../ui/button";
import PassengerSelector from "../ui/passenger-selector";
import { Airport } from "@/lib/airports";
import { FlightSearch } from "@/lib/types";

interface SearchFormProps {
  onSearch: (searchParams: FlightSearch) => void;
  isLoading: boolean;
}

interface PassengerCount {
  adults: number;
  children: number;
  babies: number;
}

type ProgramType = "all" | "latam" | "gol" | "azul";

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("roundtrip");
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    passengers: {
      adults: 1,
      children: 0,
      babies: 0,
    } as PassengerCount,
    program: "all" as ProgramType,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.origin) {
      newErrors.origin = "Selecione a origem";
    }
    if (!formData.destination) {
      newErrors.destination = "Selecione o destino";
    }
    if (
      formData.origin &&
      formData.destination &&
      formData.origin === formData.destination
    ) {
      newErrors.destination = "Origem e destino não podem ser iguais";
    }
    if (!formData.departureDate) {
      newErrors.departureDate = "Selecione a data de ida";
    }
    if (tripType === "roundtrip" && !formData.returnDate) {
      newErrors.returnDate = "Selecione a data de volta";
    }
    if (
      formData.departureDate &&
      formData.returnDate &&
      formData.returnDate <= formData.departureDate
    ) {
      newErrors.returnDate = "Data de volta deve ser após a data de ida";
    }
    if (formData.passengers.adults === 0) {
      newErrors.passengers = "É necessário pelo menos 1 adulto";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const totalPassengers =
        formData.passengers.adults + formData.passengers.children;

      onSearch({
        ...formData,
        tripType,
        departureDate:
          formData.departureDate?.toISOString().split("T")[0] || "",
        returnDate: formData.returnDate?.toISOString().split("T")[0] || "",
        passengers: totalPassengers,
        passengerDetails: formData.passengers,
      });
    }
  };

  const swapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
    setErrors((prev) => ({
      ...prev,
      origin: "",
      destination: "",
    }));
  };

  const handleAirportSelect =
    (field: "origin" | "destination") => (airport: Airport) => {
      const value = `${airport.city} (${airport.code})`;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));

      if (field === "origin" && formData.destination === value) {
        setErrors((prev) => ({
          ...prev,
          destination: "Origem e destino não podem ser iguais",
        }));
      } else if (field === "destination" && formData.origin === value) {
        setErrors((prev) => ({
          ...prev,
          destination: "Origem e destino não podem ser iguais",
        }));
      } else {
        setErrors((prev) => ({ ...prev, destination: "" }));
      }
    };

  const handleDatesChange = (startDate?: Date, endDate?: Date) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate,
      returnDate: endDate,
    }));
    setErrors((prev) => ({
      ...prev,
      departureDate: "",
      returnDate: "",
    }));
  };

  const handlePassengerChange = (passengers: PassengerCount) => {
    setFormData((prev) => ({
      ...prev,
      passengers,
    }));
    setErrors((prev) => ({ ...prev, passengers: "" }));
  };

  const handleProgramChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      program: value as ProgramType,
    }));
  };

  const programOptions = [
    {
      value: "all",
      label: "Todos os Programas",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      value: "latam",
      label: "LATAM Pass",
      icon: <Plane className="w-4 h-4 text-red-500" />,
    },
    {
      value: "gol",
      label: "Smiles",
      icon: <Plane className="w-4 h-4 text-orange-500" />,
    },
    {
      value: "azul",
      label: "TudoAzul",
      icon: <Plane className="w-4 h-4 text-blue-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative"
      style={{
        isolation: "isolate", // Importante: cria novo contexto de stacking
      }}
    >
      {/* Efeito de fundo gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#317873]/5 to-[#a0d6b4]/5 pointer-events-none rounded-3xl" />

      {/* Header com Tabs */}
      <div className="relative z-10 mb-8">
        <div className="flex bg-gray-100 rounded-2xl p-1 w-fit mx-auto">
          {[
            { id: "roundtrip", label: "🛫 Ida e Volta" },
            { id: "oneway", label: "➡️ Somente Ida" },
          ].map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setTripType(type.id as "oneway" | "roundtrip")}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative",
                tripType === type.id
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tripType === type.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-[#317873] to-[#49796b] rounded-xl shadow-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {type.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Linha 1: Origem, Swap, Destino */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Origem */}
          <div className="lg:col-span-5 relative">
            <AirportAutocomplete
              value={formData.origin}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, origin: value }))
              }
              onAirportSelect={handleAirportSelect("origin")}
              placeholder="De onde você vai?"
              label="Origem"
              error={errors.origin}
            />
          </div>

          {/* Botão Swap */}
          <div className="lg:col-span-2 flex justify-center">
            <motion.button
              type="button"
              onClick={swapLocations}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={!formData.origin && !formData.destination}
            >
              <ArrowRightLeft className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Destino */}
          <div className="lg:col-span-5 relative">
            <AirportAutocomplete
              value={formData.destination}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, destination: value }))
              }
              onAirportSelect={handleAirportSelect("destination")}
              placeholder="Para onde você vai?"
              label="Destino"
              error={errors.destination}
              disabled={!formData.origin}
            />
          </div>
        </div>

        {/* Linha 2: Datas, Passageiros, Programa */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seletor de Datas Avançado */}
          <div className="relative">
            <AdvancedDatePicker
              startDate={formData.departureDate}
              endDate={formData.returnDate}
              onDatesChange={handleDatesChange}
              isRange={tripType === "roundtrip"}
            />
          </div>

          {/* Passageiros */}
          <div className="relative">
            <PassengerSelector
              value={formData.passengers}
              onChange={handlePassengerChange}
              label="Passageiros"
            />
          </div>

          {/* Programa de Milhas */}
          <div className="relative">
            <Select
              label="Programa de Milhas"
              options={programOptions}
              value={formData.program}
              onValueChange={handleProgramChange}
            />
          </div>
        </div>

        {/* Botão de Busca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            size="lg"
            variant="gradient"
            rounded="lg"
            icon={<Search className="w-5 h-5" />}
            className="h-14 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Buscando voos...
              </span>
            ) : (
              "Buscar Passagens com Milhas"
            )}
          </Button>
        </motion.div>

        {/* Dicas Rápidas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center text-sm text-gray-600"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Melhor preço garantido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Vendedores verificados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span>Suporte 24/7</span>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
