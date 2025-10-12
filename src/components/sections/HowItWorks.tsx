"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Search, UserCheck, Shield, Plane } from "lucide-react";

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
        "Encontre os melhores voos nas principais companhias aéreas usando milhas",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: UserCheck,
      title: "Escolha um Vendedor Verificado",
      description:
        "Conecte-se com vendedores qualificados e com excelente reputação",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Negocie com Segurança",
      description:
        "Todas as transações são protegidas e monitoradas pela nossa plataforma",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Plane,
      title: "Viaje com tranquilidade",
      description: "Receba suas passagens e embarque sem preocupações",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
            Como Funciona a
            <span className="text-gradient"> Nossa Plataforma</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Um processo simples, seguro e transparente para comprar e vender
            milhas aéreas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative"
            >
              {/* Linha conectora */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-200 z-0"></div>
              )}

              <div className="relative z-10 text-center">
                {/* Ícone com gradiente */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Número do passo */}
                <div className="w-8 h-8 bg-[#317873] text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                  {index + 1}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#317873] to-[#49796b] rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-poppins">
              Pronto para começar?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Junte-se a milhares de usuários que já economizam com milhas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-[#317873] rounded-full font-bold hover:bg-gray-50 transition-colors"
              >
                Buscar Passagens
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                Quero Vender Milhas
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
