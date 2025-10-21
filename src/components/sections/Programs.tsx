"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Plane, Star, Shield, Zap, TrendingUp } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { formatNumber } from "@/lib/format-utils";

interface Program {
  id: string;
  name: string;
  airline: string;
  points: number;
  price: number;
  discount: number;
  rating: number;
  reviews: number;
  features: string[];
  badge?: string;
}

export default function Programs() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const programs: Program[] = [
    {
      id: "latam-pass",
      name: "LATAM Pass",
      airline: "LATAM Airlines",
      points: 10000,
      price: 1200,
      discount: 15,
      rating: 4.8,
      reviews: 1247,
      features: [
        "Acumulação rápida",
        "Voos nacionais e internacionais",
        "Transferência gratuita",
      ],
      badge: "Mais Popular",
    },
    {
      id: "smiles",
      name: "Smiles",
      airline: "GOL Airlines",
      points: 15000,
      price: 900,
      discount: 20,
      rating: 4.6,
      reviews: 892,
      features: [
        "Programa mais antigo",
        "Diversas parcerias",
        "Promoções frequentes",
      ],
    },
    {
      id: "tudoazul",
      name: "TudoAzul",
      airline: "Azul Airlines",
      points: 20000,
      price: 800,
      discount: 25,
      rating: 4.7,
      reviews: 756,
      features: [
        "Melhor custo-benefício",
        "Voos regionais",
        "Programa flexível",
      ],
    },
  ];

  // Função segura para formatação que funciona em SSR e Client
  const safeFormatNumber = (num: number) => {
    if (!isClient) {
      // Server-side - formato consistente
      return num.toLocaleString("pt-BR");
    }
    return formatNumber(num);
  };

  const safeFormatCurrency = (num: number) => {
    if (!isClient) {
      // Server-side - formato consistente
      return num.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      });
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8,
        ease: designSystem.animations.smooth,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: designSystem.animations.gentle,
      },
    },
  };

  return (
    <section
      id="programas"
      className="relative py-20 bg-gradient-to-br from-gray-50 to-primary-50 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-10 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/2 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: designSystem.animations.smooth }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6"
          >
            <Zap className="w-4 h-4" />
            Programas de Milhas
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
            Explore os Melhores
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Programas de Milhas
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Compare e escolha o programa de milhas que melhor se adapta às suas
            necessidades.
            <span className="font-semibold text-primary-600">
              {" "}
              Todas as opções com vendedores verificados e segurança garantida.
            </span>
          </p>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: {
                  duration: 0.3,
                  ease: designSystem.animations.gentle,
                },
              }}
              className="relative group"
            >
              {/* Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-500 overflow-hidden h-full flex flex-col">
                {/* Badge */}
                {program.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                    >
                      {program.badge}
                    </motion.div>
                  </div>
                )}

                {/* Header */}
                <div className="p-8 pb-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Plane className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 font-poppins">
                          {program.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {program.airline}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Rating */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(program.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {program.rating} ({safeFormatNumber(program.reviews)}{" "}
                      reviews)
                    </span>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-8 pt-6 flex-1 flex flex-col">
                  {/* Points and Price */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="mb-6"
                  >
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <span className="text-2xl font-bold text-gray-900 font-poppins">
                          {safeFormatNumber(program.points)}
                        </span>
                        <span className="text-gray-600 ml-1">milhas</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {program.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              {safeFormatCurrency(
                                program.price / (1 - program.discount / 100)
                              )}
                            </span>
                          )}
                          <span className="text-2xl font-bold text-primary-600 font-poppins">
                            {safeFormatCurrency(program.price)}
                          </span>
                        </div>
                        {program.discount > 0 && (
                          <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
                            -{program.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="space-y-3 mb-8 flex-1"
                  >
                    {program.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.7 + index * 0.1 + featureIndex * 0.1,
                        }}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: designSystem.shadows.lg,
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative">Comprar Milhas</span>
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">
              Não encontrou o que procurava?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Temos mais opções disponíveis e podemos ajudar você a encontrar o
              programa perfeito para suas necessidades.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              Falar com Especialista
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
