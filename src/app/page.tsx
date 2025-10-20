import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Benefits from "@/components/sections/Benefits";
import FinalCTA from "@/components/sections/FinalCTA";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Programs from "@/components/sections/Programs";
import SearchSection from "@/components/sections/SearchSection";
import Loading from "@/components/ui/loading";
import { Suspense } from "react";

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
