
import React from 'react';
import Hero from '../components/Hero';
import Manifesto from '../components/Manifesto';
import OntologyLayer from '../components/OntologyLayer'; // NEW: The "Room/Digital World"
import AtomicWorkflow from '../components/AtomicWorkflow'; 
import GlobalGrid from '../components/GlobalGrid'; 
import FutureTimeline from '../components/FutureTimeline';
import Philosophy from '../components/Philosophy';
import ValueProposition from '../components/ValueProposition';
import Features from '../components/Features';
import ProductShowcase from '../components/ProductShowcase';
import AgentEcosystem from '../components/AgentEcosystem';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import FinalCTA from '../components/FinalCTA';

interface HomeProps {
  navigateTo: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ navigateTo }) => {
  return (
    <div className="bg-[#030303] text-white overflow-x-hidden">
      {/* 1. THE AWAKENING (Introduction) */}
      <Hero navigateTo={navigateTo} />
      
      {/* 2. THE REASON (Why) */}
      <Manifesto />

      {/* 2.5 THE ONTOLOGY (The Room Concept) - NEW */}
      <OntologyLayer />

      {/* 3. THE MECHANIC (How & What - Atomic Power) */}
      <AtomicWorkflow />

      {/* 4. THE TOOLS (Who - The Agents) */}
      <div id="features">
        <AgentEcosystem navigateTo={navigateTo} />
        <ProductShowcase />
        <Features />
      </div>
      
      {/* 5. THE REACH (Where - Global Infrastructure) */}
      <GlobalGrid />
      
      {/* 6. THE VALUE (Why Us) */}
      <div id="value-prop">
        <ValueProposition />
      </div>

      {/* 7. THE EVOLUTION (When - Timeline) */}
      <FutureTimeline />

      {/* 8. THE INVESTMENT (Cost) */}
      <div id="pricing">
        <Pricing />
      </div>

      {/* 9. THE CORE BELIEF (Philosophy) */}
      <div id="philosophy">
        <Philosophy />
      </div>

      {/* 10. THE PROOF (Social) */}
      <Testimonials />

      {/* 11. THE UPLOAD (Call to Action) */}
      <FinalCTA navigateTo={navigateTo} />
    </div>
  );
};

export default Home;
