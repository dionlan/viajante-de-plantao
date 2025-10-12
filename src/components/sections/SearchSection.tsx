"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SearchForm from "@/components/search/SearchForm";
import SearchResults from "@/components/search/SearchResults";
import { FlightSearch } from "@/lib/types";

export default function SearchSection() {
  const [searchData, setSearchData] = useState<FlightSearch | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleSearch = async (searchParams: FlightSearch) => {
    setIsSearching(true);
    setSearchData(searchParams);

    // Simular busca
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
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
          className="max-w-6xl mx-auto"
        >
          <SearchForm onSearch={handleSearch} isLoading={isSearching} />
        </motion.div>

        {/* Search Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-6xl mx-auto mt-12"
        >
          <SearchResults searchData={searchData} isLoading={isSearching} />
        </motion.div>
      </div>
    </section>
  );
}
