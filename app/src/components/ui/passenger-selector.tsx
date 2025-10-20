"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Minus, Plus, Info, Baby, User, Smile } from "lucide-react";
import { cn } from "app/src/lib/utils";
import Button from "./button";

interface PassengerCount {
  adults: number;
  children: number;
  babies: number;
}

interface PassengerSelectorProps {
  value: PassengerCount;
  onChange: (count: PassengerCount) => void;
  label?: string;
  className?: string;
}

export default function PassengerSelector({
  value,
  onChange,
  label = "Passageiros",
  className,
}: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localCount, setLocalCount] = useState<PassengerCount>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxTotalPassengers = 8;
  const maxBabies = 2;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPassengers = localCount.adults + localCount.children;
  const canAddAdult = totalPassengers < maxTotalPassengers;
  const canAddChild = totalPassengers < maxTotalPassengers;
  const canAddBaby =
    localCount.babies < maxBabies && localCount.babies < localCount.adults;

  const canRemoveAdult = localCount.adults > 1;
  const canRemoveChild = localCount.children > 0;
  const canRemoveBaby = localCount.babies > 0;

  const updateCount = (
    type: keyof PassengerCount,
    operation: "increment" | "decrement"
  ) => {
    setLocalCount((prev) => {
      const newCount = { ...prev };

      if (operation === "increment") {
        if (type === "adults" && canAddAdult) {
          newCount.adults++;
        } else if (type === "children" && canAddChild) {
          newCount.children++;
        } else if (type === "babies" && canAddBaby) {
          newCount.babies++;
        }
      } else {
        if (type === "adults" && canRemoveAdult) {
          newCount.adults--;
          // Se remover adulto e houver mais bebês que adultos, ajusta bebês
          if (newCount.babies > newCount.adults) {
            newCount.babies = newCount.adults;
          }
        } else if (type === "children" && canRemoveChild) {
          newCount.children--;
        } else if (type === "babies" && canRemoveBaby) {
          newCount.babies--;
        }
      }

      return newCount;
    });
  };

  const handleConfirm = () => {
    onChange(localCount);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalCount(value);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    const parts = [];

    if (localCount.adults > 0) {
      parts.push(
        `${localCount.adults} ${localCount.adults === 1 ? "adulto" : "adultos"}`
      );
    }

    if (localCount.children > 0) {
      parts.push(
        `${localCount.children} ${
          localCount.children === 1 ? "criança" : "crianças"
        }`
      );
    }

    if (localCount.babies > 0) {
      parts.push(
        `${localCount.babies} ${localCount.babies === 1 ? "bebê" : "bebês"}`
      );
    }

    return parts.length > 0 ? parts.join(", ") : "Selecionar passageiros";
  };

  const CounterItem = ({
    type,
    icon,
    title,
    subtitle,
    value,
    onIncrement,
    onDecrement,
    canIncrement,
    canDecrement,
    showWarning = false,
  }: {
    type: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    canIncrement: boolean;
    canDecrement: boolean;
    showWarning?: boolean;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      {/* Texto e Ícone */}
      <div className="flex items-start gap-3 flex-1">
        <div className="text-[#317873] mt-1">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 text-sm">{title}</p>
            {showWarning && (
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                    O número de bebês não pode ultrapassar o de pessoas adultas
                  </div>
                </div>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">{subtitle}</span>
        </div>
      </div>

      {/* Contador */}
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          onClick={onDecrement}
          disabled={!canDecrement}
          whileHover={{ scale: canDecrement ? 1.1 : 1 }}
          whileTap={{ scale: canDecrement ? 0.9 : 1 }}
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            canDecrement
              ? "border-[#317873] text-[#317873] hover:bg-[#317873] hover:text-white"
              : "border-gray-300 text-gray-300 cursor-not-allowed"
          )}
        >
          <Minus className="w-4 h-4" />
        </motion.button>

        <span
          className={cn(
            "w-8 text-center font-medium text-sm",
            !canDecrement && !canIncrement && "text-gray-400"
          )}
        >
          {value}
        </span>

        <motion.button
          type="button"
          onClick={onIncrement}
          disabled={!canIncrement}
          whileHover={{ scale: canIncrement ? 1.1 : 1 }}
          whileTap={{ scale: canIncrement ? 0.9 : 1 }}
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            canIncrement
              ? "border-[#317873] text-[#317873] hover:bg-[#317873] hover:text-white"
              : "border-gray-300 text-gray-300 cursor-not-allowed"
          )}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-3 h-12 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#317873] focus:border-transparent",
          isOpen && "ring-2 ring-[#317873] ring-offset-2"
        )}
      >
        <Users className="w-4 h-4 text-gray-400" />
        <span
          className={cn(
            "flex-1 text-left",
            !totalPassengers && "text-gray-500"
          )}
        >
          {getDisplayText()}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[100] p-6"
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Passageiros
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Máximo {maxTotalPassengers} passageiros (adultos + crianças)
                </p>
              </div>

              {/* Contadores */}
              <div className="space-y-1 mb-6">
                <CounterItem
                  type="adults"
                  icon={<User className="w-5 h-5" />}
                  title="Pessoas adultas"
                  subtitle="12 anos ou mais"
                  value={localCount.adults}
                  onIncrement={() => updateCount("adults", "increment")}
                  onDecrement={() => updateCount("adults", "decrement")}
                  canIncrement={canAddAdult}
                  canDecrement={canRemoveAdult}
                />

                <CounterItem
                  type="children"
                  icon={<Smile className="w-5 h-5" />}
                  title="Crianças"
                  subtitle="2 a 11 anos"
                  value={localCount.children}
                  onIncrement={() => updateCount("children", "increment")}
                  onDecrement={() => updateCount("children", "decrement")}
                  canIncrement={canAddChild}
                  canDecrement={canRemoveChild}
                />

                <CounterItem
                  type="babies"
                  icon={<Baby className="w-5 h-5" />}
                  title="Bebês"
                  subtitle="Até 23 meses"
                  value={localCount.babies}
                  onIncrement={() => updateCount("babies", "increment")}
                  onDecrement={() => updateCount("babies", "decrement")}
                  canIncrement={canAddBaby}
                  canDecrement={canRemoveBaby}
                  showWarning={true}
                />
              </div>

              {/* Resumo e Limites */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total de passageiros:</span>
                  <span className="font-semibold text-gray-900">
                    {totalPassengers}{" "}
                    {totalPassengers === 1 ? "passageiro" : "passageiros"}
                  </span>
                </div>
                {localCount.babies > 0 && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-600">+ Bebês no colo:</span>
                    <span className="font-semibold text-gray-900">
                      {localCount.babies}{" "}
                      {localCount.babies === 1 ? "bebê" : "bebês"}
                    </span>
                  </div>
                )}
                {totalPassengers >= maxTotalPassengers && (
                  <p className="text-xs text-amber-600 mt-2">
                    ⚠️ Limite máximo de {maxTotalPassengers} passageiros
                    atingido
                  </p>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  onClick={handleConfirm}
                  className="flex-1"
                >
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
