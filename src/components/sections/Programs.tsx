"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { programs } from "@/lib/mockData";

export default function Programs() {
  const [activeProgram, setActiveProgram] = useState(programs[0]);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      id="programas"
      className="py-20 bg-gradient-to-br from-gray-50 to-[#a3c1ad]/30"
    >
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
            Programas de
            <span className="text-gradient"> Milhas Parceiros</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trabalhamos com os principais programas de milhas do mercado
            brasileiro
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Cards dos Programas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 ${
                  activeProgram.id === program.id
                    ? "bg-white shadow-2xl border-2 border-[#317873]"
                    : "bg-white shadow-lg border-2 border-transparent hover:shadow-xl"
                }`}
                onClick={() => setActiveProgram(program)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-[#317873]">
                        {program.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {program.name}
                  </h3>
                  <div className="text-sm text-gray-600 mb-3">
                    Cotação: R$ {program.conversionRate.toFixed(2)}
                  </div>
                  <div
                    className={`w-full h-1 rounded-full ${
                      activeProgram.id === program.id
                        ? "bg-gradient-to-r from-[#317873] to-[#a0d6b4]"
                        : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detalhes do Programa Ativo */}
          <motion.div
            key={activeProgram.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-2xl flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-[#317873]">
                    {activeProgram.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {activeProgram.name}
                </h3>
                <p className="text-gray-600">{activeProgram.description}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Cotação Atual
              </h4>
              <div className="bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-xl p-4 text-white text-center">
                <div className="text-3xl font-bold mb-1">
                  R$ {activeProgram.conversionRate.toFixed(2)}
                </div>
                <div className="text-sm opacity-90">por 1.000 milhas</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Principais Vantagens
              </h4>
              <div className="space-y-2">
                {activeProgram.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-gray-700"
                  >
                    <div className="w-2 h-2 bg-[#317873] rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulador de Milhas */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                Simulador de Milhas
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de Milhas
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    defaultValue="10000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#317873]"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>1.000</span>
                    <span>10.000</span>
                    <span>100.000</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-lg font-bold text-[#317873]">
                      R$ 140,00
                    </div>
                    <div className="text-xs text-gray-600">Valor em Reais</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-lg font-bold text-[#317873]">
                      10.000
                    </div>
                    <div className="text-xs text-gray-600">Milhas</div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#317873] to-[#49796b] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Comprar Milhas
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
