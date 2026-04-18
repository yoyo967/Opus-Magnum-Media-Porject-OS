
import React from 'react';
import { BookIcon, SparkleIcon, BrainIcon } from '../constants';

interface CampaignProps {
  navigateTo: (page: string) => void;
}

const Section: React.FC<{
  icon: React.ReactNode;
  overline: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ icon, overline, title, children, className }) => (
  <section className={`py-16 sm:py-20 border-b border-white/10 ${className}`}>
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-purple-300">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-purple-300 tracking-widest uppercase">{overline}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{title}</h2>
          </div>
        </div>
        <div className="mt-8 text-gray-400 prose prose-invert max-w-none prose-p:leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  </section>
);

const Campaign: React.FC<CampaignProps> = ({ navigateTo }) => {
  return (
    <div>
      <header className="text-center pt-20 pb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter">The Conductor's Journey</h1>
        <p className="text-lg text-purple-300 font-mono mt-2">:: From Graduate to Mastery ::</p>
        <p className="max-w-3xl mx-auto mt-4 text-gray-400">
          Our vision is a closed ecosystem that not only educates talents but guides them on their entire career path to mastery. This is the story of that journey.
        </p>
      </header>

      {/* --- Act 1: The Education --- */}
      <Section
        icon={<BookIcon />}
        overline="Act 1"
        title="The Foundation of Mastery"
        className="bg-gradient-to-b from-transparent to-[#1C1C1C]/30"
      >
        <p>The journey begins in the <strong>Academy</strong>, our knowledge center. Here we lay the foundation. Future marketing professionals learn not just theory, but work with the core technologies that form the foundation of the Project OS: Framer for lightning-fast web design and n8n for powerful workflow automation.</p>
        <p>The message is clear: <em>We are training the conductors of tomorrow</em>, by giving them the tools from the start with which they will later lead entire marketing orchestras.</p>
        <button onClick={() => navigateTo('akademie')} className="mt-6 bg-white/10 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-white/20 transition-colors">
          To the Academy
        </button>
      </Section>

      {/* --- Act 2: The Revolution --- */}
      <Section
        icon={<SparkleIcon />}
        overline="Act 2"
        title="The Conductor's Revolution"
        className="bg-[#1C1C1C]/30"
      >
        <p>After training, the professional enters the stage. Here the revolution begins. For experienced Marketing Managers trapped in the daily chaos of tools, data, and reports, we present a new philosophy anchored in our <strong>Manifesto "The Conductor's Revolution"</strong>.</p>
        <blockquote className="text-xl font-semibold text-white my-6 border-l-4 border-purple-400 pl-4">
          "You don't manage marketing anymore. You orchestrate intelligence."
        </blockquote>
        <p>The campaign guides them through four phases:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>The Awakening:</strong> We show the reality of manual marketing and present the vision of an AI-driven future. Slogan: "Stop working IN marketing. Start conducting IT."</li>
          <li><strong>The Transformation:</strong> Through interactive assessments and real testimonials, the personal marketing revolution becomes tangible.</li>
          <li><strong>The Proof:</strong> Live events and challenges prove the superiority of orchestration over management.</li>
          <li><strong>The Movement:</strong> We build a global community of "Conductors" shaping the future of marketing.</li>
        </ul>
      </Section>

      {/* --- Act 3: The Ecosystem --- */}
      <Section
        icon={<BrainIcon />}
        overline="Act 3"
        title="The Ecosystem"
        className="bg-gradient-to-b from-[#1C1C1C]/30 to-transparent"
      >
        <p>The third act connects the two worlds and closes the circle. The Project OS is more than a collection of tools – it is a living ecosystem that accompanies professionals at every stage of their career.</p>
        <p>A graduate of the Academy uses the <strong>Director</strong> for initial analyses and the <strong>Strategist</strong> to forge plans. The experienced "Conductor", however, uses the <strong>Meta-Agent AURORA</strong> and the <strong>Conductor</strong> to autonomously delegate entire campaigns. He no longer works in the system, but conducts it.</p>
        <p>Thus, the graduate becomes a master. This is the "Conductor's Journey" – a continuous path of learning, growing, and mastery, powered by OPUS MAGNUM MEDIA.</p>
        <button onClick={() => navigateTo('conductor')} className="mt-6 bg-white/10 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-white/20 transition-colors">
          To the Conductor
        </button>
      </Section>
    </div>
  );
};

export default Campaign;
