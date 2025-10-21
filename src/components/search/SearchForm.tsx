"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRightLeft,
  Sparkles,
  Calendar,
  Users,
  Award,
} from "lucide-react";
import Select from "../ui/select";
import { cn } from "@/lib/utils";
import AdvancedDatePicker from "../ui/advanced-date-picker";
import AirportAutocomplete from "../ui/airport-autocomplete";
import Button from "../ui/button";
import PassengerSelector from "../ui/passenger-selector";
import { Airport } from "@/lib/airports";
import { FlightSearch } from "@/lib/types";
import Image from "next/image";
import { designSystem, designSystemClasses } from "@/lib/design-system";

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
  const [isSwapping, setIsSwapping] = useState(false);

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

  const swapLocations = async () => {
    setIsSwapping(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

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

    setIsSwapping(false);
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

  const logos = {
    LATAM: "/images/latam-logo.png",
    GOL: "/images/gol-logo.png",
    AZUL: "/images/azul-logo.png",
  };

  const programOptions = [
    {
      value: "all",
      label: "Todos os Programas",
      icon: <Sparkles className="w-4 h-4" />,
      description: "Buscar em todas as companhias",
    },
    {
      value: "latam",
      label: "LATAM Pass",
      icon: (
        <Image
          src={logos.LATAM}
          alt="LATAM Pass"
          width={20}
          height={20}
          className="object-contain"
        />
      ),
      description: "Milhas LATAM",
    },
    {
      value: "gol",
      label: "Smiles",
      icon: (
        <Image
          src={logos.GOL}
          alt="Smiles"
          width={20}
          height={20}
          className="object-contain"
        />
      ),
      description: "Milhas GOL",
    },
    {
      value: "azul",
      label: "TudoAzul",
      icon: (
        <Image
          src={logos.AZUL}
          alt="TudoAzul"
          width={20}
          height={20}
          className="object-contain"
        />
      ),
      description: "Milhas Azul",
    },
  ];

  const quickTips = [
    {
      icon: Award,
      text: "Melhor preço garantido",
      color: "text-green-500",
    },
    {
      icon: Users,
      text: "Vendedores verificados",
      color: "text-blue-500",
    },
    {
      icon: Calendar,
      text: "Suporte 24/7",
      color: "text-purple-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: designSystem.animations.smooth }}
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative"
      style={{
        isolation: "isolate",
        zIndex: 10,
      }}
    >
      {/* Efeito de fundo gradiente aprimorado */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl opacity-50"
        style={{ background: designSystem.gradients.primary }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 to-secondary-50/20 pointer-events-none rounded-3xl" />

      {/* Header com Tabs Aprimorado */}
      <div className="relative z-10 mb-8">
        <div className="flex bg-neutral-100 rounded-2xl p-1 w-fit mx-auto shadow-inner">
          {[
            { id: "roundtrip", label: "🛫 Ida e Volta", icon: ArrowRightLeft },
            { id: "oneway", label: "➡️ Somente Ida", icon: ArrowRightLeft },
          ].map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setTripType(type.id as "oneway" | "roundtrip")}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative flex items-center gap-2",
                tripType === type.id
                  ? "text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tripType === type.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl shadow-lg"
                  style={{ background: designSystem.gradients.primary }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <type.icon className="w-4 h-4" />
                {type.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Linha 1: Origem, Swap, Destino - Aprimorada */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
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

          {/* Botão Swap Aprimorado */}
          <div className="lg:col-span-2 flex justify-center items-center h-16">
            <motion.button
              type="button"
              onClick={swapLocations}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isSwapping ? { rotate: 180 } : { rotate: 0 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              style={{ background: designSystem.gradients.secondary }}
              disabled={!formData.origin && !formData.destination}
            >
              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

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

        {/* Linha 2: Datas, Passageiros, Programa - Aprimorada */}
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

          {/* Programa de Milhas Aprimorado */}
          <div className="relative">
            <Select
              label="Programa de Milhas"
              options={programOptions}
              value={formData.program}
              onValueChange={handleProgramChange}
            />
          </div>
        </div>

        {/* Botão de Busca Aprimorado */}
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
            className="h-14 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

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
              <span className="flex items-center gap-2">
                Buscar Passagens com Milhas
              </span>
            )}
          </Button>
        </motion.div>

        {/* Dicas Rápidas Aprimoradas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-6 justify-center text-sm"
        >
          {quickTips.map((tip, index) => (
            <motion.div
              key={tip.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-2 text-neutral-600 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all duration-300 ${tip.color}`}
              >
                <tip.icon className="w-4 h-4" />
              </motion.div>
              <span className="font-medium group-hover:text-neutral-900 transition-colors duration-300">
                {tip.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </form>
    </motion.div>
  );
}
