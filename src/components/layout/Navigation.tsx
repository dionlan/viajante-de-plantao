"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Menu, X, User, Shield, Star } from "lucide-react";
import Button from "../ui/button";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Como Funciona", href: "#como-funciona" },
    {
      label: "Programas",
      href: "#programas",
      dropdown: [
        {
          label: "LATAM Pass",
          href: "#latam",
          icon: <Star className="w-4 h-4" />,
        },
        {
          label: "Smiles",
          href: "#smiles",
          icon: <Star className="w-4 h-4" />,
        },
        {
          label: "TudoAzul",
          href: "#azul",
          icon: <Star className="w-4 h-4" />,
        },
      ],
    },
    { label: "Buscar Passagens", href: "#buscar" },
    { label: "Quero Vender", href: "#vender" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                isScrolled
                  ? "bg-gradient-to-r from-[#317873] to-[#a0d6b4] shadow-lg"
                  : "bg-white/20 backdrop-blur-sm border border-white/30"
              )}
            >
              <Plane
                className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  isScrolled ? "text-white" : "text-white"
                )}
              />
            </div>
            <span
              className={cn(
                "text-2xl font-bold font-poppins transition-colors duration-300",
                isScrolled ? "text-[#317873]" : "text-white"
              )}
            >
              Viajante
              <span className={isScrolled ? "text-[#a0d6b4]" : "text-white"}>
                DePlantão
              </span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <div
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <motion.button
                      className={cn(
                        "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-1",
                        isScrolled
                          ? "text-gray-700 hover:text-[#317873] hover:bg-gray-50"
                          : "text-white hover:text-[#a0d6b4] hover:bg-white/10"
                      )}
                      whileHover={{ y: -2 }}
                    >
                      {item.label}
                      <motion.span
                        animate={{
                          rotate: activeDropdown === item.label ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.span>
                    </motion.button>

                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <motion.a
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                              whileHover={{ x: 5 }}
                            >
                              {dropdownItem.icon}
                              <span>{dropdownItem.label}</span>
                            </motion.a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.a
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium transition-all duration-200",
                      isScrolled
                        ? "text-gray-700 hover:text-[#317873] hover:bg-gray-50"
                        : "text-white hover:text-[#a0d6b4] hover:bg-white/10"
                    )}
                    whileHover={{ y: -2 }}
                  >
                    {item.label}
                  </motion.a>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant={isScrolled ? "outline" : "ghost"}
              size="sm"
              className={
                !isScrolled ? "text-white border-white hover:bg-white/10" : ""
              }
            >
              <User className="w-4 h-4 mr-2" />
              Entrar
            </Button>
            <Button variant={isScrolled ? "primary" : "secondary"} size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Cadastrar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className={cn(
              "lg:hidden p-2 rounded-xl transition-colors",
              isScrolled
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-white/20 text-white hover:bg-white/30"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "lg:hidden mt-4 rounded-2xl overflow-hidden",
                isScrolled
                  ? "bg-white shadow-xl"
                  : "bg-white/10 backdrop-blur-md border border-white/20"
              )}
            >
              <div className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "block py-3 px-4 rounded-xl font-medium transition-colors",
                      isScrolled
                        ? "text-gray-700 hover:text-[#317873] hover:bg-gray-50"
                        : "text-white hover:bg-white/10"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}

                <div className="pt-4 border-t space-y-3">
                  <Button
                    variant={isScrolled ? "outline" : "ghost"}
                    fullWidth
                    className={
                      !isScrolled
                        ? "text-white border-white hover:bg-white/10"
                        : ""
                    }
                  >
                    <User className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                  <Button
                    variant={isScrolled ? "primary" : "secondary"}
                    fullWidth
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Cadastrar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
