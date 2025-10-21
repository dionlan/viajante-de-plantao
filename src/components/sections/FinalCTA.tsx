"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Plane, Shield, Clock, Users, ArrowRight, Star, Trophy } from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function FinalCTA() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const features = [
    {
      icon: Shield,
      text: "Plataforma 100% Segura",
      description: "Transações protegidas e monitoradas",
    },
    {
      icon: Clock,
      text: "Processo Instantâneo",
      description: "Conexão imediata com vendedores",
    },
    {
      icon: Users,
      text: "Comunidade Verificada",
      description: "Vendedores qualificados e confiáveis",
    },
  ];

  const trustBadges = [
    { text: "⭐️⭐️⭐️⭐️⭐️ 4.9/5", icon: Star },
    { text: "🏆 Melhor Plataforma 2024", icon: Trophy },
    { text: "🛡️ 100% Seguro", icon: Shield },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-[#317873] via-[#49796b] to-[#317873] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#a0d6b4]/10 rounded-full mix-blend-overlay filter blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: designSystem.animations.smooth }}
          className="text-center text-white max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 mb-8"
          >
            <Star className="w-4 h-4 text-[#a0d6b4]" />
            <span className="text-sm font-semibold">
              Oportunidade Exclusiva
            </span>
            <Star className="w-4 h-4 text-[#a0d6b4]" />
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-poppins leading-tight"
          >
            Comece a Economizar
            <span className="block text-[#a0d6b4]">em Suas Viagens Hoje</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed"
          >
            Junte-se a milhares de viajantes que já descobriram a melhor forma
            de comprar passagens aéreas com milhas de forma{" "}
            <span className="font-semibold text-[#a0d6b4]">
              segura, rápida e econômica
            </span>
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20"
                >
                  <feature.icon className="w-7 h-7 text-[#a0d6b4]" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{feature.text}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0 20px 40px rgba(160, 214, 180, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-white text-[#317873] rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl flex items-center space-x-3 group"
            >
              <Plane className="w-6 h-6" />
              <span>Buscar Passagens Agora</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-transparent border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Quero Vender Minhas Milhas
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="border-t border-white/20 pt-12"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.6 }}
              className="text-white/80 mb-8 text-lg"
            >
              Recomendado por milhares de viajantes satisfeitos
            </motion.p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.8 + index * 0.1, duration: 0.6 }}
                  className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-2xl text-sm backdrop-blur-sm border border-white/20"
                >
                  <badge.icon className="w-4 h-4 text-[#a0d6b4]" />
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
