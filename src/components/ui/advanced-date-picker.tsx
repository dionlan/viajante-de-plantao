"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedDatePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDatesChange: (startDate?: Date, endDate?: Date) => void;
  isRange?: boolean;
  className?: string;
}

export default function AdvancedDatePicker({
  startDate,
  endDate,
  onDatesChange,
  isRange = true,
  className,
}: AdvancedDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startDate || new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectionPhase, setSelectionPhase] = useState<"start" | "end">(
    "start"
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const minDate = new Date();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHoverDate(null);
        setSelectionPhase("start");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  const isDateSelected = (date: Date) => {
    if (!startDate && !endDate) return false;
    return (
      date.toDateString() === startDate?.toDateString() ||
      date.toDateString() === endDate?.toDateString()
    );
  };

  const handleDateClick = (date: Date) => {
    if (!isRange) {
      onDatesChange(date);
      setIsOpen(false);
      return;
    }

    if (selectionPhase === "start") {
      onDatesChange(date, undefined);
      setSelectionPhase("end");
    } else {
      if (date >= (startDate || today)) {
        onDatesChange(startDate, date);
        setIsOpen(false);
        setSelectionPhase("start");
      } else {
        // Se a data final for anterior à inicial, troca as datas
        onDatesChange(date, startDate);
        setIsOpen(false);
        setSelectionPhase("start");
      }
    }
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Dias do mês anterior
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthDays = getDaysInMonth(prevMonth);

    for (let i = prevMonthDays - firstDay + 1; i <= prevMonthDays; i++) {
      days.push(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i));
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      );
    }

    // Dias do próximo mês para completar a grade
    const totalCells = 42; // 6 semanas
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    for (let i = 1; days.length < totalCells; i++) {
      days.push(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i));
    }

    return days;
  };

  const formatDateDisplay = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calendarDays = generateCalendar();
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className={cn("relative", className)} ref={pickerRef}>
      {/* Inputs de Data */}
      <div className="flex gap-2">
        {/* Data de Ida */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ida
          </label>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "flex w-full items-center gap-3 h-12 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#317873] focus:border-transparent",
              isOpen && "ring-2 ring-[#317873] ring-offset-2"
            )}
          >
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={cn(!startDate && "text-gray-500")}>
              {startDate ? formatDateDisplay(startDate) : "Selecione"}
            </span>
          </motion.button>
        </div>

        {/* Data de Volta */}
        {isRange && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volta
            </label>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(true)}
              className={cn(
                "flex w-full items-center gap-3 h-12 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#317873] focus:border-transparent",
                isOpen && "ring-2 ring-[#317873] ring-offset-2"
              )}
            >
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className={cn(!endDate && "text-gray-500")}>
                {endDate ? formatDateDisplay(endDate) : "Selecione"}
              </span>
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => {
                setIsOpen(false);
                setHoverDate(null);
                setSelectionPhase("start");
              }}
            />

            {/* Calendário */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[100] p-6"
            >
              {/* Header do Calendário */}
              <div className="flex items-center justify-between mb-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateMonth("prev")}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </motion.button>

                <span className="font-semibold text-gray-900 text-lg">
                  {currentMonth.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateMonth("next")}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Dias da Semana */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid do Calendário */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth =
                    date.getMonth() === currentMonth.getMonth();
                  const isToday = date.toDateString() === today.toDateString();
                  const isSelected = isDateSelected(date);
                  const isInRange = isDateInRange(date);
                  const isDisabled = date < minDate;
                  const isHovering =
                    hoverDate &&
                    startDate &&
                    !endDate &&
                    ((date > startDate && date <= hoverDate) ||
                      (date < startDate && date >= hoverDate));

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.01 }}
                      onClick={() => !isDisabled && handleDateClick(date)}
                      onMouseEnter={() => !isDisabled && setHoverDate(date)}
                      disabled={isDisabled}
                      className={cn(
                        "h-10 rounded-lg text-sm font-medium transition-all duration-200 relative",
                        !isCurrentMonth && "text-gray-400",
                        isToday && !isSelected && "bg-blue-50 text-blue-600",
                        isSelected && "bg-[#317873] text-white shadow-lg",
                        isInRange && "bg-[#a0d6b4] text-[#317873]",
                        isHovering && "bg-[#e8f4ee]",
                        isDisabled && "text-gray-300 cursor-not-allowed",
                        !isDisabled && !isSelected && "hover:bg-gray-100"
                      )}
                    >
                      {date.getDate()}

                      {/* Indicador de seleção em andamento */}
                      {selectionPhase === "end" && startDate && !endDate && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            "absolute inset-0 rounded-lg border-2 border-[#317873]",
                            isHovering && "border-dashed"
                          )}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer com ações */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <motion.button
                  onClick={() => {
                    onDatesChange(
                      today,
                      isRange
                        ? new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                        : undefined
                    );
                    setIsOpen(false);
                    setSelectionPhase("start");
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm text-[#317873] font-medium hover:text-[#49796b] transition-colors"
                >
                  {isRange ? "Próxima semana" : "Hoje"}
                </motion.button>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => {
                      onDatesChange(undefined, undefined);
                      setSelectionPhase("start");
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Limpar
                  </motion.button>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-[#317873] text-white text-sm rounded-lg hover:bg-[#49796b] transition-colors"
                  >
                    Aplicar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
