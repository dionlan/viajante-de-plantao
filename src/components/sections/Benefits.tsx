"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Shield,
  Zap,
  Users,
  Trophy,
  Clock,
  Heart,
  CheckCircle,
} from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function Benefits() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const benefits = [
    {
      icon: Shield,
      title: "Transações 100% Seguras",
      description:
        "Todas as negociações são monitoradas, protegidas e garantidas pela nossa plataforma",
      features: [
        "Proteção antifraude",
        "Garantia de entrega",
        "Dados criptografados",
      ],
      color: "from-[#317873] to-[#49796b]",
      delay: 0.1,
    },
    {
      icon: Zap,
      title: "Processo Instantâneo",
      description:
        "Conecte-se em tempo real com vendedores verificados e receba propostas imediatas",
      features: [
        "Conexão em tempo real",
        "Resposta em segundos",
        "Processo automatizado",
      ],
      color: "from-[#49796b] to-[#317873]",
      delay: 0.2,
    },
    {
      icon: Users,
      title: "Comunidade Verificada",
      description:
        "Mais de 50.000 usuários satisfeitos e uma rede de vendedores qualificados",
      features: [
        "Perfis verificados",
        "Avaliações reais",
        "Histórico transparente",
      ],
      color: "from-[#317873] to-[#a0d6b4]",
      delay: 0.3,
    },
    {
      icon: Trophy,
      title: "Economia Inteligente",
      description:
        "Economize até 60% em passagens aéreas com as melhores cotações do mercado",
      features: [
        "Preços competitivos",
        "Cotações em tempo real",
        "Comparação inteligente",
      ],
      color: "from-[#a0d6b4] to-[#49796b]",
      delay: 0.4,
    },
    {
      icon: Clock,
      title: "Suporte 24/7 Dedicado",
      description:
        "Nossa equipe especializada está sempre disponível para te ajudar em qualquer horário",
      features: [
        "Atendimento humanizado",
        "Resposta rápida",
        "Solução garantida",
      ],
      color: "from-[#317873] to-[#49796b]",
      delay: 0.5,
    },
    {
      icon: Heart,
      title: "Satisfação Garantida",
      description:
        "98% dos nossos usuários recomendam e voltam a utilizar nossa plataforma",
      features: [
        "Recomendação verificada",
        "Fidelização comprovada",
        "Experiência premium",
      ],
      color: "from-[#49796b] to-[#a0d6b4]",
      delay: 0.6,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: designSystem.animations.smooth,
      },
    },
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-white via-gray-50 to-[#f8faf9] overflow-hidden">
      {/* Elementos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#317873]/10 to-[#a0d6b4]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#49796b]/10 to-[#317873]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
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
              Vantagens Exclusivas
            </span>
            <div className="w-2 h-2 bg-[#317873] rounded-full"></div>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-poppins leading-tight">
            Por que Escolher a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#317873] to-[#a0d6b4]">
              {" "}
              ViajanteDePlantão
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Oferecemos a{" "}
            <span className="font-semibold text-[#317873]">
              melhor experiência
            </span>{" "}
            em compra e venda de milhas aéreas com tecnologia avançada e
            segurança máxima
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                {/* Ícone com gradiente */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <benefit.icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Conteúdo */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                  {benefit.description}
                </p>

                {/* Lista de features */}
                <ul className="space-y-3">
                  {benefit.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: benefit.delay + featureIndex * 0.1 }}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-[#317873] flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 0.8,
            duration: 0.8,
            ease: designSystem.animations.smooth,
          }}
          className="relative bg-gradient-to-r from-[#317873] to-[#49796b] rounded-3xl p-12 text-white overflow-hidden"
        >
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins">
              Números que Comprovam Nossa Qualidade
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                {
                  number: "50K+",
                  label: "Passagens Vendidas",
                  suffix: "usuários satisfeitos",
                },
                {
                  number: "R$2M+",
                  label: "Economia Gerada",
                  suffix: "em milhas negociadas",
                },
                {
                  number: "4.9★",
                  label: "Avaliação Média",
                  suffix: "baseada em reviews reais",
                },
                {
                  number: "98%",
                  label: "Taxa de Satisfação",
                  suffix: "de clientes recomendam",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm opacity-80">{stat.suffix}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
