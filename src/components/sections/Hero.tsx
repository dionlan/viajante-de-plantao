"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Search,
  Shield,
  Plane,
  ArrowRight,
  Star,
  Sparkles,
  TrendingUp,
  Heart,
  Globe,
} from "lucide-react";
import { designSystem, designSystemClasses } from "@/lib/design-system";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const stats = [
    {
      number: "50K+",
      label: "Passagens Vendidas",
      description: "usuários satisfeitos",
      icon: Plane,
    },
    {
      number: "R$2M+",
      label: "Economia Gerada",
      description: "em milhas negociadas",
      icon: TrendingUp,
    },
    {
      number: "4.9★",
      label: "Avaliação Média",
      description: "baseada em reviews",
      icon: Star,
    },
    {
      number: "98%",
      label: "Satisfação",
      description: "taxa de recomendação",
      icon: Heart,
    },
  ];

  // Canvas com partículas usando cores do design system
  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      color: string;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.speedZ = (Math.random() - 0.5) * 0.3;
        // Usando cores do design system
        const colors = [
          designSystem.colors.primary[400],
          designSystem.colors.secondary[400],
          designSystem.colors.accent[500],
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.z += this.speedZ;

        if (this.z > 1000) this.z = 0;
        if (this.z < 0) this.z = 1000;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        const dx = this.x - mousePosition.x;
        const dy = this.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.x += dx * force * 0.02;
          this.y += dy * force * 0.02;
        }
      }

      draw() {
        const scale = 1 - this.z / 1000;
        const x = this.x;
        const y = this.y;
        const size = this.size * scale;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity * scale;
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
              ctx.beginPath();
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = 0.1 * (1 - distance / 80);
              ctx.lineWidth = 0.2;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mousePosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Elementos flutuantes com cores do design system
  const FloatingOrb = ({ top, left, right, size, color, delay }: any) => (
    <motion.div
      className="absolute rounded-full mix-blend-overlay filter blur-3xl"
      style={{
        top,
        left,
        right,
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, 0],
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 15,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  // Scroll suave para busca
  const scrollToSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    const searchSection = document.getElementById("buscar");
    if (searchSection) {
      const headerHeight = 80;
      const elementPosition = searchSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 py-20"
      style={{
        background: designSystem.gradients.primary,
      }}
    >
      {/* Canvas Interativo */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Elementos de Fundo com cores do design system */}
      <div className="absolute inset-0 z-1">
        {/* Efeito de grade sutil */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${designSystem.colors.primary[500]} 1px, transparent 1px), linear-gradient(90deg, ${designSystem.colors.primary[500]} 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {/* Overlay de profundidade */}
      <div
        className="absolute inset-0 z-2"
        style={{
          background: `linear-gradient(to bottom, ${designSystem.colors.primary[900]}40, transparent, ${designSystem.colors.primary[900]}40)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: designSystem.animations.smooth }}
          className="max-w-6xl mx-auto"
        >
          {/* Heading Principal */}
          <motion.div className="mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 font-poppins leading-tight"
            >
              Revolucionamos o
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#a0d6b4] to-white">
                Mercado de Milhas
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
              className={`${designSystemClasses.text.body} text-white/90 max-w-6xl mx-auto leading-relaxed font-light`}
            >
              Conectamos você aos melhores vendedores verificados com{" "}
              <motion.span
                className="font-semibold"
                style={{
                  color: designSystem.colors.secondary[300],
                }}
                whileHover={{ scale: 1.05 }}
              >
                segurança, transparência e os melhores preços
              </motion.span>{" "}
              em milhas aéreas.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20"
          >
            <motion.button
              onClick={scrollToSearch}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: designSystem.shadows.xl,
              }}
              whileTap={{ scale: 0.97 }}
              className="px-12 py-5 bg-white rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-500 shadow-2xl flex items-center space-x-3 group relative overflow-hidden"
              style={{
                color: designSystem.colors.primary[700],
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Search className="w-6 h-6" />
              <span>Buscar Passagens com Milhas</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                y: -3,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderColor: "rgba(255,255,255,0.5)",
              }}
              whileTap={{ scale: 0.97 }}
              className="px-12 py-5 bg-transparent border-2 border-white/40 text-white rounded-2xl font-bold text-lg hover:bg-white/15 transition-all duration-500 backdrop-blur-xl shadow-2xl hover:shadow-3xl flex items-center space-x-3"
            >
              <Globe className="w-6 h-6" />
              <span>Quero Vender Minhas Milhas</span>
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{
                  delay: 1.3 + index * 0.15,
                  duration: 0.6,
                  ease: designSystem.animations.gentle,
                }}
                whileHover={{
                  scale: 1.08,
                  y: -5,
                  transition: {
                    duration: 0.3,
                    ease: designSystem.animations.bounce,
                  },
                }}
                className="text-center group cursor-pointer"
              >
                <motion.div
                  className="w-24 h-24 bg-white/15 rounded-3xl flex flex-col items-center justify-center mx-auto mb-5 backdrop-blur-xl border border-white/30 group-hover:bg-white/20 group-hover:border-white/50 transition-all duration-500 relative overflow-hidden shadow-2xl group-hover:shadow-3xl"
                  whileHover={{ rotateY: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <stat.icon
                    className="w-7 h-7 mb-2 group-hover:scale-110 transition-transform duration-300"
                    style={{ color: designSystem.colors.secondary[400] }}
                  />
                  <div className="text-2xl font-black text-white font-poppins group-hover:text-secondary-300 transition-colors duration-300">
                    {stat.number}
                  </div>
                </motion.div>
                <div className="text-lg font-bold text-white mb-2 font-poppins">
                  {stat.label}
                </div>
                <div
                  className={`${designSystemClasses.text.caption} text-white/80 group-hover:text-white/90 transition-colors duration-300`}
                >
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
