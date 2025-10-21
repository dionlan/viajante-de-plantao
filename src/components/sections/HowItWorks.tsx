"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Search,
  UserCheck,
  Shield,
  Plane,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function HowItWorks() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const steps = [
    {
      icon: Search,
      title: "Busque sua Passagem",
      description:
        "Encontre os melhores voos nas principais companhias aéreas usando milhas com nossa busca inteligente",
      features: [
        "Busca em tempo real",
        "Comparação de preços",
        "Filtros avançados",
      ],
      color: "from-[#317873] to-[#49796b]",
      delay: 0.1,
    },
    {
      icon: UserCheck,
      title: "Conecte com Vendedores",
      description:
        "Escolha entre vendedores verificados com excelente reputação e histórico de transações",
      features: ["Perfis verificados", "Avaliações reais", "Suporte dedicado"],
      color: "from-[#49796b] to-[#317873]",
      delay: 0.2,
    },
    {
      icon: Shield,
      title: "Transação Segura",
      description:
        "Realize negociações protegidas com garantia de entrega e suporte 24/7",
      features: ["Pagamento seguro", "Garantia de entrega", "Suporte integral"],
      color: "from-[#317873] to-[#a0d6b4]",
      delay: 0.3,
    },
    {
      icon: Plane,
      title: "Embarque Tranquilo",
      description:
        "Receba suas passagens com confirmação imediata e embarque sem preocupações",
      features: [
        "Confirmação instantânea",
        "Documentação completa",
        "Assistência pré-embarque",
      ],
      color: "from-[#a0d6b4] to-[#49796b]",
      delay: 0.4,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: designSystem.animations.smooth,
      },
    },
  };

  return (
    <section
      id="como-funciona"
      className="relative py-24 bg-gradient-to-br from-white via-gray-50 to-[#f8faf9] overflow-hidden"
    >
      {/* Elementos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-[#317873]/10 to-[#a0d6b4]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#49796b]/10 to-[#317873]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: designSystem.animations.smooth }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-[#317873]/20 rounded-2xl px-6 py-3 mb-8 shadow-lg"
          >
            <div className="w-2 h-2 bg-[#317873] rounded-full"></div>
            <span className="text-sm font-semibold text-[#317873] uppercase tracking-wide">
              Processo Simplificado
            </span>
            <div className="w-2 h-2 bg-[#317873] rounded-full"></div>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-poppins leading-tight">
            Como Funciona Nossa
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#317873] to-[#a0d6b4]">
              {" "}
              Plataforma
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Um processo{" "}
            <span className="font-semibold text-[#317873]">
              simples, seguro e transparente
            </span>{" "}
            para comprar e vender milhas aéreas com total confiança
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-20"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              custom={step.delay}
              className="group relative"
            >
              {/* Card Principal */}
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                {/* Número do passo */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-[#317873] to-[#49796b] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                {/* Ícone animado */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Conteúdo */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins leading-tight">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                  {step.description}
                </p>

                {/* Lista de features */}
                <ul className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: step.delay + featureIndex * 0.1 }}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-[#317873] flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Seta decorativa */}
                {index < steps.length - 1 && (
                  <div className="hidden xl:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <motion.div
                      animate={{ x: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-full flex items-center justify-center"
                    >
                      <ArrowRight className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 0.8,
            duration: 0.8,
            ease: designSystem.animations.smooth,
          }}
          className="text-center"
        >
          <div className="relative bg-gradient-to-r from-[#317873] to-[#49796b] rounded-3xl p-12 text-white overflow-hidden">
            {/* Elementos decorativos do CTA */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 font-poppins">
                Pronto para Começar sua Jornada?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Junte-se a milhares de usuários que já economizam com milhas e
                vivem experiências incríveis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(49, 120, 115, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-[#317873] rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl"
                >
                  🛫 Buscar Passagens
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  💰 Quero Vender Milhas
                </motion.button>
              </div>

              {/* Estatísticas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 }}
                className="flex justify-center gap-12 mt-12 pt-8 border-t border-white/20"
              >
                {[
                  { number: "50K+", label: "Usuários Ativos" },
                  { number: "R$2M+", label: "Economizados" },
                  { number: "4.9★", label: "Avaliação" },
                ].map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold mb-1">{stat.number}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
