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
import FlightLoading from "@/lib/FlightLoading";

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
    searchParams.searchType = 'miles';
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
        <FlightLoading isSearching={isSearching} />
      </div>
    </section>
  );
}
