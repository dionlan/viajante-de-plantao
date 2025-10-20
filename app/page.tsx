import { Suspense } from "react";
import Header from "./src/components/layout/Header";
import Loading from "./src/components/ui/loading";
import SearchSection from "./src/components/sections/SearchSection";
import Hero from "./src/components/sections/Hero";
import HowItWorks from "./src/components/sections/HowItWorks";
import Programs from "./src/components/sections/Programs";
import Benefits from "./src/components/sections/Benefits";
import FinalCTA from "./src/components/sections/FinalCTA";
import Footer from "./src/components/layout/Footer";

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