"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SearchForm from "../search/SearchForm";
import SearchResults from "../search/SearchResults";
import { FlightSearch, Flight } from "@/lib/types";
import { FlightSearchService } from "@/services/flight-search";
import { Z_INDEX } from "@/lib/constants";
import { designSystem } from "@/lib/design-system";
import { Plane, Sparkles } from "lucide-react";

export default function SearchSection() {
  const [searchData, setSearchData] = useState<FlightSearch | null>(null);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleSearch = async (searchParams: FlightSearch) => {
    console.log("🚀 Iniciando busca com parâmetros:", searchParams);

    setIsSearching(true);
    setSearchData(searchParams);
    setSearchError(null);
    setSearchResults([]);

    try {
      const results = await FlightSearchService.searchFlights(searchParams);
      console.log("✅ Resultados obtidos:", results.length, "voos");

      if (results.length === 0) {
        setSearchError("Nenhum voo encontrado para os critérios selecionados.");
      }

      setSearchResults(results);
    } catch (error: unknown) {
      console.error("❌ Erro na busca:", error);
      if (error instanceof Error) {
        setSearchError(error.message);
      } else {
        setSearchError(
          "Ocorreu um erro desconhecido na busca. Tente novamente."
        );
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleRetry = () => {
    if (searchData) {
      handleSearch(searchData);
    }
  };

  return (
    <section
      id="buscar"
      className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-[#f0f9f8] overflow-hidden"
      style={{ zIndex: Z_INDEX.base }}
    >
      {/* Elementos de fundo decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#317873]/5 to-[#a0d6b4]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-[#49796b]/5 to-[#317873]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#a0d6b4]/5 to-[#317873]/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: designSystem.animations.smooth,
          }}
          className="text-center mb-20 relative"
          style={{ zIndex: Z_INDEX.content }}
        >
          {/* Badge decorativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#317873]/20 rounded-full px-4 py-2 mb-6 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#317873]" />
            <span className="text-sm font-medium text-[#317873]">
              Plataforma Inteligente
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-poppins leading-tight">
            Encontre{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#317873] to-[#a0d6b4]">
              Ofertas Exclusivas
            </span>
            <br />
            em Milhas
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Pesquise passagens aéreas nas principais companhias e conecte-se
            <span className="font-semibold text-[#317873]">
              {" "}
              diretamente com vendedores verificados
            </span>{" "}
            em tempo real
          </motion.p>
        </motion.div>

        {/* Main Content Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.4,
              duration: 0.8,
              ease: designSystem.animations.smooth,
            }}
            className="relative"
            style={{
              zIndex: Z_INDEX.dropdown,
              isolation: "isolate",
            }}
          >
            <SearchForm onSearch={handleSearch} isLoading={isSearching} />
          </motion.div>

          {/* Search Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{
              delay: 0.6,
              duration: 0.8,
              ease: designSystem.animations.smooth,
            }}
            className="relative mt-12"
            style={{
              zIndex: Z_INDEX.content,
              position: "relative",
            }}
          >
            <SearchResults
              searchData={searchData}
              isLoading={isSearching}
              searchResults={searchResults}
              error={searchError}
              onRetry={handleRetry}
            />
          </motion.div>
        </div>

        {/* Loading State */}
        {/* Loading State */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-b from-sky-100 via-white to-sky-200 flex flex-col items-center justify-center overflow-hidden"
            style={{ zIndex: Z_INDEX.overlay }}
          >
            {/* Fundo com nuvens animadas */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 2 }}
            >
              <div className="absolute w-[200%] h-full bg-[url('/clouds.svg')] bg-repeat-x bg-[length:800px_400px] opacity-70 animate-clouds" />
            </motion.div>

            {/* Avião animado subindo */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: [100, -20, 0], opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
              className="relative flex flex-col items-center"
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, -2, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-24 h-24 flex items-center justify-center bg-gradient-to-tr from-[#317873] to-[#a0d6b4] rounded-3xl shadow-lg"
              >
                <Plane className="w-10 h-10 text-white" />
              </motion.div>

              {/* Trilha de fumaça animada */}
              <motion.div
                className="w-1 h-12 mt-2 bg-gradient-to-b from-white/70 to-transparent rounded-full"
                animate={{ opacity: [0.6, 0.2, 0.6], scaleY: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            {/* Mensagens dinâmicas */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-center mt-10"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-2 tracking-tight font-poppins">
                Preparando sua decolagem...
              </h3>
              <motion.p
                className="text-gray-600 text-lg"
                animate={{
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Buscando as melhores rotas e ofertas do céu 🌤️
              </motion.p>
            </motion.div>

            {/* Barra de progresso animada */}
            <div className="relative mt-10 w-64 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#317873] via-[#56b5a6] to-[#a0d6b4]"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Mensagem inferior com pontinhos */}
            <motion.div
              className="mt-6 text-gray-500 text-sm font-medium"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
              }}
            >
              Embarcando no sistema de milhagens...
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
