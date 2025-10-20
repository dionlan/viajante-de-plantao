"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Plane, Shield, Clock, Users } from "lucide-react";

export default function FinalCTA() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="py-20 bg-gradient-to-br from-[#317873] to-[#49796b] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-poppins">
            Comece a Economizar
            <span className="block text-[#a0d6b4]">em Suas Viagens Hoje</span>
          </h2>

          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Junte-se a milhares de viajantes que já descobriram a melhor forma
            de comprar passagens aéreas com milhas
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            {[
              { icon: Shield, text: "Plataforma 100% Segura" },
              { icon: Clock, text: "Processo Instantâneo" },
              { icon: Users, text: "Vendedores Verificados" },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className="flex items-center justify-center space-x-3"
              >
                <feature.icon className="w-6 h-6 text-[#a0d6b4]" />
                <span className="text-lg font-semibold">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-[#317873] rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-2xl flex items-center space-x-2"
            >
              <Plane className="w-5 h-5" />
              <span>Buscar Passagens Agora</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              Quero Vender Minhas Milhas
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-white/80 mb-6">
              Recomendado por milhares de viajantes
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              {[
                "⭐️⭐️⭐️⭐️⭐️ 4.9/5",
                "🏆 Melhor Plataforma 2024",
                "🛡️ 100% Seguro",
              ].map((badge, index) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                  className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm"
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
