"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Menu,
  X,
  User,
  Shield,
  Star,
  ChevronDown,
  Search,
  TrendingUp,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Button from "../ui/button";
import { cn } from "@/lib/utils";
import { designSystem } from "@/lib/design-system";

export default function Navigation() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollY / scrollHeight) * 100, 100);

      setScrollProgress(progress);
      setIsScrolled(scrollY > 10);
    };

    let ticking = false;
    const updateScroll = () => {
      handleScroll();
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Função para determinar cores baseadas no estado do scroll
  const getNavColors = () => {
    if (!isScrolled) {
      return {
        text: {
          primary: designSystem.colors.neutral[50],
          secondary: designSystem.colors.secondary[200],
          hover: designSystem.colors.secondary[50],
          active: designSystem.colors.secondary[400],
        },
        background: {
          primary: "transparent",
          hover: "rgba(255, 255, 255, 0.15)",
          active: "rgba(255, 255, 255, 0.25)",
        },
        icon: {
          primary: designSystem.colors.secondary[300],
          hover: designSystem.colors.secondary[50],
          active: designSystem.colors.secondary[400],
        },
      };
    }

    return {
      text: {
        primary: designSystem.colors.neutral[800],
        secondary: designSystem.colors.primary[600],
        hover: designSystem.colors.primary[700],
        active: designSystem.colors.primary[500],
      },
      background: {
        primary: `rgba(255, 255, 255, ${Math.min(scrollProgress / 80, 0.98)})`,
        hover: `${designSystem.colors.primary[50]}90`,
        active: `${designSystem.colors.primary[100]}90`,
      },
      icon: {
        primary: designSystem.colors.primary[600],
        hover: designSystem.colors.primary[700],
        active: designSystem.colors.primary[500],
      },
    };
  };

  const menuItems = [
    {
      label: "Como Funciona",
      href: "#como-funciona",
      icon: Zap,
      iconColor: designSystem.colors.secondary[500],
    },
    {
      label: "Programas",
      href: "#programas",
      icon: Star,
      iconColor: designSystem.colors.secondary[500],
      dropdown: [
        {
          label: "LATAM Pass",
          href: "#latam",
          icon: (
            <div className="w-6 h-6 flex items-center justify-center">
              <img
                src="/images/latam-logo.png"
                alt="LATAM"
                className="w-5 h-5 object-contain"
              />
            </div>
          ),
          description: "Programa LATAM Airlines",
          accentColor: designSystem.colors.primary[500],
          company: "LATAM",
        },
        {
          label: "Smiles",
          href: "#smiles",
          icon: (
            <div className="w-6 h-6 flex items-center justify-center">
              <img
                src="/images/gol-logo.png"
                alt="GOL"
                className="w-5 h-5 object-contain"
              />
            </div>
          ),
          description: "Programa GOL Airlines",
          accentColor: designSystem.colors.primary[500],
          company: "GOL",
        },
        {
          label: "TudoAzul",
          href: "#azul",
          icon: (
            <div className="w-6 h-6 flex items-center justify-center">
              <img
                src="/images/azul-logo.png"
                alt="Azul"
                className="w-5 h-5 object-contain"
              />
            </div>
          ),
          description: "Programa Azul Airlines",
          accentColor: designSystem.colors.primary[500],
          company: "Azul",
        },
      ],
    },
    {
      label: "Buscar Passagens",
      href: "#buscar",
      icon: Search,
      iconColor: designSystem.colors.secondary[500],
      highlight: true,
    },
    {
      label: "Quero Vender",
      href: "#vender",
      icon: TrendingUp,
      iconColor: designSystem.colors.secondary[500],
    },
  ];

  const colors = getNavColors();
  const blurIntensity = Math.min(scrollProgress / 2, 12);

  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl animate-pulse" />
              <div className="h-8 w-40 bg-primary-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Barra de Progresso - Usando cores do design system */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-60 origin-left"
        style={{
          scaleX: scrollProgress / 100,
          opacity: isScrolled ? 0.9 : 0,
          background: designSystem.gradients.secondary,
        }}
        transition={{ duration: 0.15, ease: designSystem.animations.gentle }}
      />

      {/* Header Principal */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          ease: designSystem.animations.expressive,
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/98 backdrop-blur-xl shadow-2xl border-b border-neutral-100/80"
            : "bg-transparent"
        )}
        style={{
          backdropFilter: `blur(${isScrolled ? blurIntensity + 6 : 0}px)`,
          WebkitBackdropFilter: `blur(${isScrolled ? blurIntensity + 6 : 0}px)`,
          backgroundColor: colors.background.primary,
          paddingTop: isScrolled
            ? designSystem.spacing.sm
            : designSystem.spacing.lg,
          paddingBottom: isScrolled
            ? designSystem.spacing.sm
            : designSystem.spacing.lg,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center space-x-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl relative overflow-hidden",
                  isScrolled
                    ? "bg-gradient-to-br from-primary-500 to-secondary-500 shadow-2xl"
                    : "bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl"
                )}
                style={{
                  background: isScrolled
                    ? designSystem.gradients.secondary
                    : "rgba(255, 255, 255, 0.15)",
                }}
                whileHover={{
                  rotate: 5,
                  scale: 1.08,
                  transition: {
                    duration: 0.3,
                    ease: designSystem.animations.gentle,
                  },
                }}
              >
                {/* Overlay de brilho no hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Efeito de profundidade */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-50" />

                <Plane
                  className="w-6 h-6 relative z-10 transition-all duration-300"
                  style={{
                    color: isScrolled
                      ? designSystem.colors.neutral[50]
                      : designSystem.colors.secondary[50],
                    filter: isScrolled
                      ? "none"
                      : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  }}
                />
              </motion.div>

              {/* Texto da Logo */}
              <motion.div className="flex flex-col">
                <motion.span
                  className={cn(
                    "text-2xl font-bold font-poppins transition-all duration-500 leading-tight",
                    isScrolled ? "text-neutral-900" : "text-white"
                  )}
                  style={{
                    textShadow: isScrolled
                      ? "none"
                      : `0 2px 8px rgba(0, 0, 0, 0.3)`,
                  }}
                >
                  Viajante
                  <span
                    className={cn(
                      "transition-colors duration-500",
                      isScrolled ? "text-primary-600" : "text-secondary-300"
                    )}
                  >
                    DePlantão
                  </span>
                </motion.span>

                {/* Subtítulo sutil */}
                <motion.span
                  className={cn(
                    "text-xs font-inter font-medium transition-all duration-500 mt-1",
                    isScrolled ? "text-neutral-500" : "text-white/70"
                  )}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    textShadow: isScrolled
                      ? "none"
                      : `0 1px 2px rgba(0, 0, 0, 0.2)`,
                  }}
                >
                  Suas milhas sempre valem
                </motion.span>
              </motion.div>
            </motion.a>

            {/* Desktop Navigation Premium */}
            <nav className="hidden lg:flex items-center space-x-2">
              {menuItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.dropdown ? (
                    <div
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <motion.button
                        className={cn(
                          "px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 group relative overflow-hidden",
                          isScrolled
                            ? "text-neutral-700 hover:text-primary-600 hover:bg-primary-50/90"
                            : "text-white/90 hover:text-white hover:bg-white/15",
                          item.highlight &&
                            !isScrolled &&
                            "bg-white/20 text-white shadow-lg"
                        )}
                        style={{
                          color: isScrolled
                            ? colors.text.primary
                            : colors.text.primary,
                        }}
                        whileHover={{
                          y: -1,
                          backgroundColor: colors.background.hover,
                          color: colors.text.hover,
                          transition: {
                            duration: 0.2,
                            ease: designSystem.animations.gentle,
                          },
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Efeito de brilho sofisticado */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                        {/* Background sutil no container */}
                        <div
                          className={cn(
                            "absolute inset-0 rounded-2xl transition-all duration-300",
                            isScrolled
                              ? "bg-white/5 group-hover:bg-white/10"
                              : "bg-white/5 group-hover:bg-white/10"
                          )}
                        />

                        {item.icon && (
                          <item.icon
                            className={cn(
                              "w-4 h-4 transition-colors duration-300 relative z-10"
                            )}
                            style={{
                              color: isScrolled
                                ? colors.icon.primary
                                : item.iconColor,
                            }}
                          />
                        )}
                        <span
                          className="relative z-10"
                          style={{
                            color: "inherit",
                          }}
                        >
                          {item.label}
                        </span>
                        <motion.span
                          animate={{
                            rotate: activeDropdown === item.label ? 180 : 0,
                          }}
                          transition={{
                            duration: 0.2,
                            ease: designSystem.animations.smooth,
                          }}
                          className="text-xs relative z-10"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </motion.span>
                      </motion.button>

                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{
                              duration: 0.2,
                              ease: designSystem.animations.smooth,
                            }}
                            className="absolute top-full left-0 mt-3 w-80 bg-white/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-neutral-100/80 overflow-hidden z-50"
                            style={{
                              background: designSystem.gradients.card,
                            }}
                          >
                            {/* Header do dropdown */}
                            <div className="px-5 py-4 border-b border-neutral-100/50 bg-gradient-to-r from-primary-50/50 to-secondary-50/50">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                                  <Sparkles className="w-4 h-4 text-primary-600" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-neutral-900 text-sm">
                                    Programas de Milhas
                                  </h3>
                                  <p className="text-neutral-600 text-xs">
                                    Escolha sua companhia aérea
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Itens do dropdown */}
                            <div className="py-2">
                              {item.dropdown.map((dropdownItem, index) => (
                                <motion.a
                                  key={dropdownItem.label}
                                  href={dropdownItem.href}
                                  className="flex items-center gap-4 px-5 py-4 text-neutral-700 hover:bg-gradient-to-r hover:from-primary-50/80 hover:to-secondary-50/80 transition-all duration-300 border-b border-neutral-100/30 last:border-b-0 group relative overflow-hidden"
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: index * 0.08,
                                    duration: 0.15,
                                    ease: designSystem.animations.gentle,
                                  }}
                                  whileHover={{
                                    x: 4,
                                    transition: { duration: 0.2 },
                                  }}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {/* Efeito de brilho no hover */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />

                                  {/* Background do container do item */}
                                  <div className="absolute inset-2 rounded-xl bg-white/50 group-hover:bg-white/80 transition-all duration-300" />

                                  {/* Ícone/Logo da companhia */}
                                  <div className="relative z-10 flex-shrink-0">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-neutral-100 group-hover:shadow-lg transition-all duration-300">
                                      {dropdownItem.icon}
                                    </div>
                                  </div>

                                  {/* Conteúdo */}
                                  <div className="flex-1 min-w-0 relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div
                                        className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors duration-300 text-sm"
                                        style={{
                                          color: dropdownItem.accentColor,
                                        }}
                                      >
                                        {dropdownItem.label}
                                      </div>
                                      {/* Badge da companhia */}
                                      <span
                                        className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 border border-primary-200"
                                        style={{
                                          backgroundColor: `${dropdownItem.accentColor}15`,
                                          color: dropdownItem.accentColor,
                                          borderColor: `${dropdownItem.accentColor}30`,
                                        }}
                                      >
                                        {dropdownItem.company}
                                      </span>
                                    </div>
                                    <div className="text-xs text-neutral-500 group-hover:text-neutral-600 leading-relaxed">
                                      {dropdownItem.description}
                                    </div>

                                    {/* Indicador de ação */}
                                    <motion.div
                                      className="flex items-center gap-1 mt-2 text-xs text-neutral-400 group-hover:text-primary-500 transition-colors duration-300"
                                      initial={{ opacity: 0 }}
                                      whileHover={{ opacity: 1 }}
                                    >
                                      <span>Explorar programa</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </motion.div>
                                  </div>

                                  {/* Indicador visual */}
                                  <div className="relative z-10 flex-shrink-0">
                                    <div
                                      className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-150"
                                      style={{
                                        backgroundColor:
                                          dropdownItem.accentColor,
                                      }}
                                    />
                                  </div>
                                </motion.a>
                              ))}
                            </div>

                            {/* Footer do dropdown */}
                            <div className="px-5 py-3 border-t border-neutral-100/50 bg-gradient-to-r from-neutral-50/50 to-neutral-100/30">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-500">
                                  3 programas disponíveis
                                </span>
                                <motion.a
                                  href="#programas"
                                  className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 flex items-center gap-1"
                                  whileHover={{ x: 2 }}
                                >
                                  Ver todos
                                  <ArrowRight className="w-3 h-3" />
                                </motion.a>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.a
                      href={item.href}
                      className={cn(
                        "px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 group relative overflow-hidden",
                        isScrolled
                          ? "text-neutral-700 hover:text-primary-600 hover:bg-primary-50/90"
                          : "text-white/90 hover:text-white hover:bg-white/15",
                        item.highlight &&
                          !isScrolled &&
                          "bg-white/20 text-white shadow-lg"
                      )}
                      style={{
                        color: isScrolled
                          ? colors.text.primary
                          : colors.text.primary,
                      }}
                      whileHover={{
                        y: -1,
                        backgroundColor: colors.background.hover,
                        color: colors.text.hover,
                        transition: {
                          duration: 0.2,
                          ease: designSystem.animations.gentle,
                        },
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Efeito de brilho sofisticado */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                      {/* Background sutil no container */}
                      <div
                        className={cn(
                          "absolute inset-0 rounded-2xl transition-all duration-300",
                          isScrolled
                            ? "bg-white/5 group-hover:bg-white/10"
                            : "bg-white/5 group-hover:bg-white/10"
                        )}
                      />

                      {item.icon && (
                        <item.icon
                          className={cn(
                            "w-4 h-4 transition-colors duration-300 relative z-10"
                          )}
                          style={{
                            color: isScrolled
                              ? colors.icon.primary
                              : item.iconColor,
                          }}
                        />
                      )}
                      <span
                        className="relative z-10"
                        style={{
                          color: "inherit",
                        }}
                      >
                        {item.label}
                      </span>

                      {/* Indicador de destaque */}
                      {item.highlight && (
                        <motion.div
                          className="relative z-10"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <div className="w-2 h-2 bg-secondary-400 rounded-full" />
                        </motion.div>
                      )}
                    </motion.a>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isScrolled ? "outline" : "ghost"}
                  size="sm"
                  className={cn(
                    "transition-all duration-300 font-semibold border-2",
                    !isScrolled &&
                      "text-white border-white/40 hover:bg-white/15 hover:border-white/60"
                  )}
                  style={{
                    color: isScrolled
                      ? colors.text.secondary
                      : colors.text.primary,
                    borderColor: isScrolled
                      ? colors.text.secondary
                      : "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  <User
                    className="w-4 h-4 mr-2"
                    style={{
                      color: isScrolled
                        ? colors.icon.primary
                        : colors.icon.primary,
                    }}
                  />
                  Entrar
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={isScrolled ? "primary" : "secondary"}
                  size="sm"
                  className="shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Cadastrar
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={cn(
                "lg:hidden p-3 rounded-2xl transition-all duration-300 relative overflow-hidden",
                isScrolled
                  ? "bg-primary-50 text-primary-700 hover:bg-primary-100 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-xl shadow-lg"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: isScrolled
                  ? colors.background.hover
                  : "rgba(255, 255, 255, 0.2)",
                color: isScrolled ? colors.icon.primary : colors.text.primary,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 relative z-10" />
              ) : (
                <Menu className="w-5 h-5 relative z-10" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.98 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.98 }}
                transition={{
                  duration: 0.25,
                  ease: designSystem.animations.smooth,
                }}
                className={cn(
                  "lg:hidden mt-4 rounded-3xl overflow-hidden border-2",
                  isScrolled
                    ? "bg-white/98 shadow-3xl border-neutral-200/80"
                    : "bg-white/15 backdrop-blur-2xl border-white/30 shadow-3xl"
                )}
                style={{
                  backgroundColor: colors.background.primary,
                }}
              >
                <div className="p-4 space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 py-3.5 px-4 rounded-2xl font-semibold transition-all duration-300 group relative overflow-hidden",
                        isScrolled
                          ? "text-neutral-700 hover:text-primary-700 hover:bg-primary-50/90"
                          : "text-white hover:bg-white/20"
                      )}
                      style={{
                        color: isScrolled
                          ? colors.text.primary
                          : colors.text.primary,
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.07,
                        duration: 0.2,
                        ease: designSystem.animations.gentle,
                      }}
                      whileHover={{
                        x: 3,
                        backgroundColor: colors.background.hover,
                        color: colors.text.hover,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                      {item.icon && (
                        <item.icon
                          className={cn("w-4 h-4 flex-shrink-0 relative z-10")}
                          style={{
                            color: isScrolled
                              ? colors.icon.primary
                              : item.iconColor,
                          }}
                        />
                      )}
                      <span className="relative z-10 text-sm">
                        {item.label}
                      </span>
                      {item.highlight && (
                        <motion.span
                          className={cn(
                            "ml-auto px-2.5 py-1 text-xs rounded-full font-bold relative z-10"
                          )}
                          style={{
                            backgroundColor: isScrolled
                              ? colors.background.hover
                              : "rgba(255, 255, 255, 0.3)",
                            color: isScrolled
                              ? colors.text.secondary
                              : colors.text.primary,
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          Destaque
                        </motion.span>
                      )}
                    </motion.a>
                  ))}

                  <motion.div
                    className="pt-4 border-t border-neutral-200/50 space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant={isScrolled ? "outline" : "ghost"}
                      fullWidth
                      className={cn(
                        "justify-center font-semibold border-2",
                        !isScrolled &&
                          "text-white border-white/40 hover:bg-white/15"
                      )}
                      style={{
                        color: isScrolled
                          ? colors.text.secondary
                          : colors.text.primary,
                        borderColor: isScrolled
                          ? colors.text.secondary
                          : "rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      <User
                        className="w-4 h-4 mr-2"
                        style={{
                          color: isScrolled
                            ? colors.icon.primary
                            : colors.icon.primary,
                        }}
                      />
                      Entrar
                    </Button>
                    <Button
                      variant={isScrolled ? "primary" : "secondary"}
                      fullWidth
                      className="justify-center font-semibold shadow-2xl"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Cadastrar
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
