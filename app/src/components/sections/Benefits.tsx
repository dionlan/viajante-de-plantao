"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Shield, Zap, Users, Trophy, Clock, Heart } from "lucide-react";

export default function Benefits() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const benefits = [
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Todas as transações são monitoradas e protegidas",
      color: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Processo Rápido",
      description: "Conecte-se instantaneamente com vendedores verificados",
      color: "text-yellow-600",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Mais de 50.000 usuários satisfeitos",
      color: "text-green-600",
    },
    {
      icon: Trophy,
      title: "Melhores Preços",
      description: "Economize até 60% em passagens aéreas",
      color: "text-purple-600",
    },
    {
      icon: Clock,
      title: "Suporte 24/7",
      description: "Nossa equipe está sempre disponível",
      color: "text-orange-600",
    },
    {
      icon: Heart,
      title: "Satisfação Garantida",
      description: "98% dos usuários recomendam nossa plataforma",
      color: "text-pink-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
            Por que Escolher a
            <span className="text-gradient"> ViajanteDePlantao?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Oferecemos a melhor experiência em compra e venda de milhas aéreas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-inner ${benefit.color}`}
                >
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-[#317873] to-[#49796b] rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
              <div className="text-white/80">Passagens Vendidas</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">2M+</div>
              <div className="text-white/80">Milhas Negociadas</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">4.9</div>
              <div className="text-white/80">Avaliação Média</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
              <div className="text-white/80">Satisfação</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
