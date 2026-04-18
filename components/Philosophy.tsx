
import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    {children}
  </svg>
);

const BrainIcon: React.FC = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.004 1.11-1.226a2.25 2.25 0 012.593 1.226c.09.542.56 1.004 1.11 1.226a2.25 2.25 0 011.226 2.593c-.222.55-.684 1.02-1.226 1.11a2.25 2.25 0 01-2.593-1.226c-.09-.542-.56-1.004-1.11-1.226a2.25 2.25 0 01-1.226-2.593c.222-.55.684-1.02 1.226-1.11zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
const TargetIcon: React.FC = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;


const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-20 sm:py-32 bg-[#1C1C1C]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Philosophy Card */}
          <div className="bg-[#0A0A0A] p-8 rounded-lg border border-[#333333] flex gap-6 items-start">
            <div className="text-purple-400 flex-shrink-0 mt-1">
              <BrainIcon />
            </div>
            <div>
              <h3 className="font-medium text-xl text-[#F5F5F5]">Philosophy</h3>
              <p className="mt-2 text-[#888888] leading-relaxed">
                "Where strategy meets art." AI as a tool to amplify human creativity, not replace it.
              </p>
            </div>
          </div>
          {/* Mission Card */}
          <div className="bg-[#0A0A0A] p-8 rounded-lg border border-[#333333] flex gap-6 items-start">
            <div className="text-blue-400 flex-shrink-0 mt-1">
                <TargetIcon />
            </div>
            <div>
              <h3 className="font-medium text-xl text-[#F5F5F5]">Mission Statement</h3>
              <p className="mt-2 text-[#888888] leading-relaxed">
                Our mission is to fuse strategic precision with creative excellence, empowering demanding professionals to amplify their vision through intelligent AI tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
