"use client";

import { motion } from "framer-motion";
import {
  Plane,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    company: [
      { name: "Sobre Nós", href: "#" },
      { name: "Como Funciona", href: "#como-funciona" },
      { name: "Blog", href: "#" },
      { name: "Carreiras", href: "#" },
    ],
    programs: [
      { name: "LATAM Pass", href: "#programas" },
      { name: "Smiles", href: "#programas" },
      { name: "TudoAzul", href: "#programas" },
      { name: "Todos os Programas", href: "#programas" },
    ],
    support: [
      { name: "Ajuda", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Contato", href: "#" },
      { name: "Política de Privacidade", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-poppins">
                <span className="text-[#a0d6b4]">Viajante</span>De<span className="text-[#a0d6b4]">Plantão</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 mb-6 leading-relaxed"
            >
              Revolucionando o mercado de milhas aéreas com segurança,
              transparência e os melhores preços.
            </motion.p>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>contato@viajantedeplantao.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Brasília, Brasil</span>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(links).map(([category, items], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (categoryIndex + 1) }}
            >
              <h3 className="font-semibold text-lg mb-4 text-white capitalize">
                {category === "company"
                  ? "Empresa"
                  : category === "programs"
                  ? "Programas"
                  : "Suporte"}
              </h3>
              <ul className="space-y-2">
                {items.map((link, index) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5, color: "#a0d6b4" }}
                      className="text-gray-400 hover:text-[#a0d6b4] transition-colors duration-200"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-gray-400 mb-4 md:mb-0">
            © {currentYear} ViajanteDePlantao. Todos os direitos reservados.
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.2, color: "#a0d6b4" }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-[#a0d6b4] transition-colors duration-200"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
