import { motion } from "framer-motion";
import { Plane } from "lucide-react";

const Z_INDEX = {
  overlay: 9999,
};

interface FlightLoadingProps {
  isSearching: boolean;
}

export default function FlightLoading({ isSearching }: FlightLoadingProps) {
  if (!isSearching) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-sky-100 via-white to-sky-200 flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: Z_INDEX.overlay }}
    >
      {/* Fundo de nuvens animadas */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute w-[300%] h-full bg-[url('/clouds.svg')] bg-repeat-x bg-[length:800px_400px] animate-clouds opacity-70" />
      </motion.div>

      {/* Avião subindo */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: [100, -20, 0], opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="relative flex flex-col items-center"
      >
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, -3, 2, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 flex items-center justify-center bg-gradient-to-tr from-[#317873] to-[#a0d6b4] rounded-3xl shadow-xl"
        >
          <Plane className="w-10 h-10 text-white" />
        </motion.div>

        {/* Trilha de fumaça */}
        <motion.div
          className="w-1 h-12 mt-3 bg-gradient-to-b from-white/80 to-transparent rounded-full"
          animate={{ opacity: [0.6, 0.2, 0.6], scaleY: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Mensagem principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-center mt-10"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-2 tracking-tight font-poppins">
          Preparando sua decolagem ✈️
        </h3>
        <motion.p
          className="text-gray-600 text-lg"
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Buscando as melhores rotas e ofertas do céu 🌤️
        </motion.p>
      </motion.div>

      {/* Barra de progresso */}
      <div className="relative mt-10 w-64 h-2 bg-gray-300/50 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#317873] via-[#56b5a6] to-[#a0d6b4]"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Mensagem inferior */}
      <motion.div
        className="mt-6 text-gray-500 text-sm font-medium"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        Embarcando no sistema de milhagens...
      </motion.div>
    </motion.div>
  );
}
