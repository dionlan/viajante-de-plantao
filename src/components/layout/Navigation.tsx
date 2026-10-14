// components/layout/Navigation.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
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

// Logos dos programas
const logos = {
  LATAM: "/images/latam-logo.png",
  GOL: "/images/gol-logo.png",
  AZUL: "/images/azul-logo.png",
};

export default function Navigation() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Otimização do scroll handler com threshold ajustado
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min((scrollY / scrollHeight) * 100, 100);

    setScrollProgress(progress);
    // Threshold mais sensível para transição suave
    setIsScrolled(scrollY > 5);
  }, []);

  useEffect(() => {
    setIsMounted(true);

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Sistema de cores otimizado com transição mais suave
  const getNavColors = useCallback(() => {
    const opacity = Math.min(scrollProgress / 60, 0.92);

    const baseColors = {
      scrolled: {
        text: {
          primary: designSystem.colors.neutral[800],
          secondary: designSystem.colors.primary[600],
          hover: designSystem.colors.primary[700],
          active: designSystem.colors.primary[500],
        },
        background: {
          primary: `rgba(255, 255, 255, ${opacity})`,
          hover: `${designSystem.colors.primary[50]}60`,
          active: `${designSystem.colors.primary[100]}90`,
        },
        icon: {
          primary: designSystem.colors.primary[600],
          hover: designSystem.colors.primary[700],
          active: designSystem.colors.primary[500],
        },
      },
      transparent: {
        text: {
          primary: designSystem.colors.neutral[50],
          secondary: designSystem.colors.secondary[200],
          hover: designSystem.colors.secondary[50],
          active: designSystem.colors.secondary[400],
        },
        background: {
          primary: "transparent",
          hover: "rgba(255, 255, 255, 0.12)",
          active: "rgba(255, 255, 255, 0.20)",
        },
        icon: {
          primary: designSystem.colors.secondary[300],
          hover: designSystem.colors.secondary[50],
          active: designSystem.colors.secondary[400],
        },
      },
    };

    return isScrolled ? baseColors.scrolled : baseColors.transparent;
  }, [isScrolled, scrollProgress]);

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
                src={logos.LATAM}
                alt="LATAM"
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextSibling as HTMLDivElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm hidden">
                LA
              </div>
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
                src={logos.GOL}
                alt="GOL"
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextSibling as HTMLDivElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm hidden">
                GO
              </div>
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
                src={logos.AZUL}
                alt="Azul"
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextSibling as HTMLDivElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm hidden">
                AZ
              </div>
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
  const blurIntensity = Math.min(scrollProgress / 3, 8);

  // Loading state otimizado
  if (!isMounted) {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-500"
        style={{
          background: designSystem.gradients.primary,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30" />
              <div className="text-white font-bold text-lg">
                ViajanteDePlantão
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Barra de Progresso */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-60 origin-left"
        style={{
          scaleX: scrollProgress / 100,
          opacity: isScrolled ? 0.8 : 0,
          background: designSystem.gradients.secondary,
        }}
        transition={{ duration: 0.15, ease: designSystem.animations.gentle }}
      />

      {/* Header Principal com altura reduzida */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          ease: designSystem.animations.expressive,
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
          isScrolled
            ? "bg-white/90 shadow-lg border-neutral-100/60"
            : "bg-transparent border-transparent"
        )}
        style={{
          backdropFilter: `blur(${isScrolled ? blurIntensity : 0}px)`,
          WebkitBackdropFilter: `blur(${isScrolled ? blurIntensity : 0}px)`,
          paddingTop: isScrolled ? "0.75rem" : "1rem",
          paddingBottom: isScrolled ? "0.75rem" : "1rem",
          height: isScrolled ? "70px" : "80px",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo - Mantida sempre visível */}
            <motion.a
              href="#"
              className="flex items-center space-x-2 sm:space-x-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredItem("logo")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg relative overflow-hidden",
                  isScrolled
                    ? "bg-gradient-to-br from-primary-500 to-secondary-500 shadow-md"
                    : "bg-white/15 backdrop-blur-md border border-white/30 shadow-lg"
                )}
                whileHover={{
                  rotate: 5,
                  scale: 1.05,
                  transition: {
                    duration: 0.3,
                    ease: designSystem.animations.gentle,
                  },
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Plane
                  className="w-5 h-5 relative z-10 transition-all duration-300"
                  style={{
                    color: isScrolled
                      ? designSystem.colors.neutral[500]
                      : designSystem.colors.secondary[300],
                  }}
                />
              </motion.div>

              <motion.div className="flex flex-col">
                <motion.span
                  className={cn(
                    "text-xl sm:text-2xl font-bold font-poppins transition-all duration-500 leading-tight",
                    isScrolled ? "text-neutral-900" : "text-white"
                  )}
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
                <motion.span
                  className={cn(
                    "text-[10px] sm:text-xs font-inter font-medium transition-all duration-500 mt-0.5",
                    isScrolled ? "text-neutral-500" : "text-white/70"
                  )}
                >
                  Suas milhas sempre valem
                </motion.span>
              </motion.div>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-0">
              {menuItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.dropdown ? (
                    <div
                      onMouseEnter={() => {
                        setActiveDropdown(item.label);
                        setHoveredItem(item.label);
                      }}
                      onMouseLeave={() => {
                        setActiveDropdown(null);
                        setHoveredItem(null);
                      }}
                    >
                      <motion.button
                        className={cn(
                          "px-3 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 group relative overflow-hidden mx-1",
                          isScrolled
                            ? "text-neutral-700 hover:text-primary-600 hover:bg-primary-50/80"
                            : "text-white/90 hover:text-white hover:bg-white/12",
                          hoveredItem === item.label &&
                            (isScrolled
                              ? "text-primary-600 bg-primary-50/80"
                              : "text-white bg-white/12")
                        )}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700",
                            hoveredItem === item.label
                              ? "translate-x-0"
                              : "-translate-x-full"
                          )}
                        />
                        {item.icon && (
                          <item.icon
                            className="w-4 h-4 relative z-10 transition-colors duration-300"
                            style={{
                              color:
                                hoveredItem === item.label
                                  ? isScrolled
                                    ? colors.icon.hover
                                    : colors.icon.hover
                                  : isScrolled
                                  ? colors.icon.primary
                                  : colors.icon.primary,
                            }}
                          />
                        )}
                        <span className="relative z-10 text-sm transition-colors duration-300">
                          {item.label}
                        </span>
                        <ChevronDown className="w-3 h-3 relative z-10 transition-transform duration-300" />
                      </motion.button>

                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-neutral-100/70 overflow-hidden z-50"
                            style={{
                              background: "rgba(255, 255, 255, 0.97)",
                              backdropFilter: "blur(20px)",
                            }}
                          >
                            {/* Header do dropdown com cor personalizada */}
                            <div
                              className="px-4 py-3 border-b border-neutral-100/50"
                              style={{
                                background: `linear-gradient(135deg, ${designSystem.colors.primary[50]} 0%, ${designSystem.colors.secondary[50]} 100%)`,
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-sm">
                                  <Sparkles className="w-3 h-3 text-white" />
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

                            <div className="py-1">
                              {item.dropdown.map((dropdownItem, index) => (
                                <motion.a
                                  key={dropdownItem.label}
                                  href={dropdownItem.href}
                                  className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-gradient-to-r hover:from-primary-50/60 hover:to-secondary-50/60 transition-all duration-200 border-b border-neutral-100/30 last:border-b-0 group"
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.06 }}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <div className="relative z-10 flex-shrink-0">
                                    {dropdownItem.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors duration-200 text-sm">
                                        {dropdownItem.label}
                                      </div>
                                      <span
                                        className="px-1.5 py-0.5 text-xs font-medium rounded-full border"
                                        style={{
                                          backgroundColor: `${designSystem.colors.primary[50]}`,
                                          color:
                                            designSystem.colors.primary[700],
                                          borderColor:
                                            designSystem.colors.primary[200],
                                        }}
                                      >
                                        {dropdownItem.company}
                                      </span>
                                    </div>
                                    <div className="text-xs text-neutral-500 group-hover:text-neutral-600 leading-tight">
                                      {dropdownItem.description}
                                    </div>
                                  </div>
                                </motion.a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.a
                      href={item.href}
                      className={cn(
                        "px-3 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 group relative overflow-hidden mx-1 text-sm",
                        isScrolled
                          ? "text-neutral-700 hover:text-primary-600 hover:bg-primary-50/80"
                          : "text-white/90 hover:text-white hover:bg-white/12",
                        item.highlight &&
                          !isScrolled &&
                          "bg-white/18 text-white",
                        hoveredItem === item.label &&
                          (isScrolled
                            ? "text-primary-600 bg-primary-50/80"
                            : "text-white bg-white/12")
                      )}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700",
                          hoveredItem === item.label
                            ? "translate-x-0"
                            : "-translate-x-full"
                        )}
                      />
                      {item.icon && (
                        <item.icon
                          className="w-4 h-4 relative z-10 transition-colors duration-300"
                          style={{
                            color:
                              hoveredItem === item.label
                                ? isScrolled
                                  ? colors.icon.hover
                                  : colors.icon.hover
                                : isScrolled
                                ? colors.icon.primary
                                : colors.icon.primary,
                          }}
                        />
                      )}
                      <span className="relative z-10 transition-colors duration-300">
                        {item.label}
                      </span>
                    </motion.a>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant={isScrolled ? "outline" : "ghost"}
                size="sm"
                className={cn(
                  "transition-all duration-300 font-semibold border",
                  !isScrolled && "text-white border-white/30 hover:bg-white/12"
                )}
                onMouseEnter={() => setHoveredItem("login")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <User className="w-4 h-4 mr-1" />
                <span className="text-sm">Entrar</span>
              </Button>
              <Button
                variant={isScrolled ? "primary" : "secondary"}
                size="sm"
                className="shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm"
                onMouseEnter={() => setHoveredItem("register")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Shield className="w-4 h-4 mr-1" />
                <span className="text-sm">Cadastrar</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={cn(
                "lg:hidden p-2 rounded-xl transition-all duration-300 relative overflow-hidden",
                isScrolled
                  ? "bg-primary-50 text-primary-700 hover:bg-primary-100 shadow-sm"
                  : "bg-white/18 text-white hover:bg-white/25 backdrop-blur-md"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHoveredItem("mobile-menu")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700",
                  hoveredItem === "mobile-menu"
                    ? "translate-x-0"
                    : "-translate-x-full"
                )}
              />
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
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
                className={cn(
                  "lg:hidden mt-3 rounded-xl overflow-hidden border backdrop-blur-xl",
                  isScrolled
                    ? "bg-white/95 shadow-xl border-neutral-200/60"
                    : "bg-white/15 border-white/30 shadow-2xl"
                )}
              >
                <div className="p-3 space-y-1">
                  {menuItems.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 py-2.5 px-3 rounded-lg font-semibold transition-all duration-300 text-sm",
                        isScrolled
                          ? "text-neutral-700 hover:text-primary-700 hover:bg-primary-50/80"
                          : "text-white hover:bg-white/18"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </motion.a>
                  ))}

                  <div className="pt-2 border-t border-white/20 space-y-2">
                    <Button
                      variant={isScrolled ? "outline" : "ghost"}
                      fullWidth
                      className={cn(
                        "justify-center font-semibold border text-sm",
                        !isScrolled &&
                          "text-white border-white/30 hover:bg-white/12"
                      )}
                    >
                      <User className="w-4 h-4 mr-1" />
                      Entrar
                    </Button>
                    <Button
                      variant={isScrolled ? "primary" : "secondary"}
                      fullWidth
                      className="justify-center font-semibold shadow-lg text-sm"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Cadastrar
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
