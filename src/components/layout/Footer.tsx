"use client";

import { motion } from "framer-motion";
import {
  Plane,
  Mail,
  Phone,
  MapPin,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
  Shield,
  Star,
  Heart,
} from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    company: [
      { name: "Sobre Nós", href: "#" },
      { name: "Como Funciona", href: "#como-funciona" },
      { name: "Blog", href: "#" },
      { name: "Carreiras", href: "#" },
      { name: "Imprensa", href: "#" },
    ],
    programs: [
      { name: "LATAM Pass", href: "#programas" },
      { name: "Smiles", href: "#programas" },
      { name: "TudoAzul", href: "#programas" },
      { name: "Multiplus", href: "#programas" },
      { name: "Todos os Programas", href: "#programas" },
    ],
    support: [
      { name: "Central de Ajuda", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Contato", href: "#" },
      { name: "Política de Privacidade", href: "#" },
      { name: "Termos de Uso", href: "#" },
    ],
    resources: [
      { name: "Guia de Milhas", href: "#" },
      { name: "Dicas de Viagem", href: "#" },
      { name: "Calculadora", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Newsletter", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Youtube, href: "#", label: "Youtube", color: "hover:text-red-500" },
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
  ];

  const trustBadges = [
    { icon: Shield, text: "Plataforma 100% Segura" },
    { icon: Star, text: "Avaliação 4.9/5" },
    { icon: Heart, text: "98% Satisfação" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#1a2a2a] text-white overflow-hidden">
      {/* Elementos de fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#317873]/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#a0d6b4]/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: designSystem.animations.smooth,
              }}
              className="lg:col-span-2"
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Plane className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-3xl font-bold font-poppins">
                  <span className="text-[#a0d6b4]">Viajante</span>De
                  <span className="text-[#a0d6b4]">Plantão</span>
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-300 mb-8 leading-relaxed text-lg max-w-md"
              >
                Revolucionando o mercado de milhas aéreas com segurança,
                transparência e os melhores preços para conectar você às
                melhores oportunidades de viagem.
              </motion.p>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 mb-8"
              >
                {trustBadges.map((badge, index) => (
                  <motion.div
                    key={badge.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <badge.icon className="w-5 h-5 text-[#a0d6b4]" />
                    <span className="text-sm font-medium">{badge.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <motion.a
                  href="mailto:contato@viajantedeplantao.com"
                  whileHover={{ x: 5, color: "#a0d6b4" }}
                  className="flex items-center gap-3 text-gray-300 hover:text-[#a0d6b4] transition-all duration-300 group"
                >
                  <Mail className="w-5 h-5" />
                  <span>contato@viajantedeplantao.com</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>

                <motion.a
                  href="tel:+5511999999999"
                  whileHover={{ x: 5, color: "#a0d6b4" }}
                  className="flex items-center gap-3 text-gray-300 hover:text-[#a0d6b4] transition-all duration-300 group"
                >
                  <Phone className="w-5 h-5" />
                  <span>+55 (11) 99999-9999</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-gray-300 transition-all duration-300"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Brasília, Brasil - Centro Financeiro</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Links Sections */}
            {Object.entries(links).map(([category, items], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (categoryIndex + 1), duration: 0.6 }}
              >
                <h3 className="font-bold text-xl mb-6 text-white font-poppins border-l-4 border-[#a0d6b4] pl-3">
                  {category === "company" && "Empresa"}
                  {category === "programs" && "Programas"}
                  {category === "support" && "Suporte"}
                  {category === "resources" && "Recursos"}
                </h3>
                <ul className="space-y-3">
                  {items.map((link, index) => (
                    <li key={link.name}>
                      <motion.a
                        href={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        whileHover={{ x: 5, color: "#a0d6b4" }}
                        className="text-gray-300 hover:text-[#a0d6b4] transition-all duration-300 flex items-center gap-2 group"
                      >
                        <div className="w-1.5 h-1.5 bg-[#317873] rounded-full group-hover:bg-[#a0d6b4] transition-colors"></div>
                        <span>{link.name}</span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 pt-12 border-t border-gray-700/50"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4 font-poppins">
                Fique por Dentro das Melhores Ofertas
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Receba alertas de promoções, dicas de milhas e oportunidades
                exclusivas diretamente no seu email.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 px-4 py-3 bg-white/10 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#a0d6b4] focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                />
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(160, 214, 180, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-[#317873] to-[#a0d6b4] text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300"
                >
                  Assinar Newsletter
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-gray-400 text-center lg:text-left"
              >
                <p className="text-sm">
                  © {currentYear} ViajanteDePlantao. Todos os direitos
                  reservados.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Desenvolvido com ❤️ para viajantes que amam economizar
                </p>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <span className="text-gray-400 text-sm mr-2">Siga-nos:</span>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
