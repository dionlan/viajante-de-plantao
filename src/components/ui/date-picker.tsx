"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  label,
  error,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  const today = new Date();
  const currentDate = value || today;

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

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty days
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      );
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const calendarDays = generateCalendar();

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-12 w-full items-center gap-3 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#317873] focus:ring-offset-2",
            error && "border-red-500 focus:ring-red-500",
            isOpen && "ring-2 ring-[#317873] ring-offset-2"
          )}
        >
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={cn(!value && "text-gray-500")}>
            {value ? formatDate(value) : "Selecione uma data"}
          </span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4"
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateMonth("prev")}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                <span className="font-semibold text-gray-900">
                  {currentMonth.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateMonth("next")}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    onClick={() =>
                      date && !isDateDisabled(date) && onChange(date)
                    }
                    disabled={!date || isDateDisabled(date)}
                    className={cn(
                      "h-8 rounded-lg text-sm transition-all duration-200",
                      date && !isDateDisabled(date)
                        ? "hover:bg-gray-100 text-gray-900"
                        : "text-gray-400",
                      date && date.toDateString() === currentDate.toDateString()
                        ? "bg-[#317873] text-white hover:bg-[#49796b]"
                        : "",
                      !date && "invisible"
                    )}
                  >
                    {date?.getDate()}
                  </motion.button>
                ))}
              </div>

              {/* Today Button */}
              <motion.button
                onClick={() => onChange(today)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-3 py-2 text-sm text-[#317873] font-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                Hoje
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
