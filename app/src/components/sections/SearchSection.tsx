"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FlightSearch, Flight } from "app/src/lib/types";
import { FlightSearchService } from "app/src/services/flight-search";
import SearchForm from "../search/SearchForm";
import SearchResults from "../search/SearchResults";

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
      // ESTA CHAMADA AGORA USA O RAILWAY AUTOMATICAMENTE
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
      className="py-20 bg-gradient-to-br from-gray-50 to-[#a3c1ad]/20"
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
            Encontre as Melhores
            <span className="text-gradient"> Ofertas em Milhas</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pesquise passagens aéreas nas principais companhias e conecte-se
            diretamente com vendedores verificados.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <SearchForm onSearch={handleSearch} isLoading={isSearching} />
        </motion.div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        {/* Search Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
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
    </section>
  );
}
