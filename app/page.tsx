import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Programs from "@/components/sections/Programs";
import SearchSection from "@/components/sections/SearchSection";
import Benefits from "@/components/sections/Benefits";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/ui/loading"; // Crie este componente

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<Loading />}>
        <Header />
        <main>
          <Hero />
          <SearchSection />
          <HowItWorks />
          <Programs />
          <Benefits />
          <FinalCTA />
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}