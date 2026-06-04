
import React, { useState } from 'react';
import { useTasks } from '../contexts/AppContext';

const Logo: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19.5" stroke="#FFFFFF" strokeOpacity="0.5" />
    <circle cx="20" cy="20" r="16" fill="#F5F5F5" />
  </svg>
);

const CommandControlIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const AllSeeingEyeIcon: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 
        className="text-gray-400 group-hover:text-white transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.7)] group-hover:rotate-12">
        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
);

const ChevronDownIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1.5 opacity-70">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

interface NavLinkProps {
  page: string;
  currentPage: string;
  navigateTo: (page: string) => void;
  children: React.ReactNode;
  isTopLevel?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ page, currentPage, navigateTo, children, isTopLevel = false }) => {
    const baseClass = "transition-colors duration-300 text-sm";
    const activeClass = "text-white font-medium";
    const inactiveClass = "text-gray-400 hover:text-white";
    const topLevelClass = isTopLevel ? ` ${currentPage === page ? activeClass : inactiveClass}` : '';
    
    return (
        <button onClick={() => navigateTo(page)} className={`${baseClass}${topLevelClass}`}>
            {children}
        </button>
    );
};

interface DropdownProps {
    title: string;
    children: React.ReactNode;
}

const NavDropdown: React.FC<DropdownProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button className="flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-300">
                {title}
                <ChevronDownIcon />
            </button>
            {isOpen && (
                <div className="absolute top-full w-64 bg-[#111111]/80 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl p-2 z-10 animate-[fadeIn_0.2s_ease-out]">
                    {children}
                </div>
            )}
        </div>
    );
};

const DropdownItem: React.FC<{ page: string, currentPage: string, navigateTo: (page: string) => void, title: string, description: string }> = ({ page, currentPage, navigateTo, title, description }) => {
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => navigateTo(page)}
            className={`w-full text-left p-3 rounded-md transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
        >
            <span className="font-medium text-white">{title}</span>
            <span className="block text-xs text-gray-400 mt-1">{description}</span>
        </button>
    );
};


interface HeaderProps {
  navigateTo: (page: string) => void;
  currentPage: string;
  onOpenCommandBar: () => void;
  isSecretMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ navigateTo, currentPage, onOpenCommandBar, isSecretMode }) => {
  const { user, login, logout, userProfile } = useTasks();

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('home')} className="flex items-center gap-3 cursor-pointer">
              <Logo />
              <div>
                <span className="text-lg font-medium text-[#F5F5F5] block leading-none">OPUS MAGNUM MEDIA®</span>
                <span className="text-xs text-[#888888] block leading-none mt-1">Project OS</span>
              </div>
            </button>
            <button onClick={() => navigateTo('einreichung')} className="p-2 group" title="System Initialization">
                <AllSeeingEyeIcon />
            </button>
        </div>
        
        <div className="hidden lg:flex items-center">
            <button 
                onClick={() => navigateTo('aioperator')} 
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 font-mono text-xs tracking-widest ${currentPage === 'aioperator' ? 'bg-[#A855F7]/20 border-[#A855F7] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-[#A855F7]/50 hover:text-white'}`}
            >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentPage === 'aioperator' ? 'bg-[#A855F7]' : 'bg-gray-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${currentPage === 'aioperator' ? 'bg-[#A855F7]' : 'bg-gray-500'}`}></span>
                </span>
                AI OPERATOR
            </button>
        </div>
        
        <nav className="hidden md:flex items-center gap-4">
            <NavLink page="observatorium" currentPage={currentPage} navigateTo={navigateTo} isTopLevel>Mission Control</NavLink>
            <NavLink page="meisterwerk" currentPage={currentPage} navigateTo={navigateTo} isTopLevel>Masterpiece</NavLink>
            <NavLink page="masterplan" currentPage={currentPage} navigateTo={navigateTo} isTopLevel>Masterplan</NavLink>
            
            <NavDropdown title="Strategy & Analysis">
                <DropdownItem page="dirigent" currentPage={currentPage} navigateTo={navigateTo} title="Director" description="Analyzes project status & gives recommendations." />
                <DropdownItem page="stratege" currentPage={currentPage} navigateTo={navigateTo} title="Strategist" description="Develops complete campaign strategies." />
                <DropdownItem page="persona" currentPage={currentPage} navigateTo={navigateTo} title="Persona" description="Creates AI-driven buyer personas." />
                <DropdownItem page="analytiker" currentPage={currentPage} navigateTo={navigateTo} title="Analyst" description="Visualizes & analyzes performance data." />
                <DropdownItem page="orakel" currentPage={currentPage} navigateTo={navigateTo} title="Oracle" description="Performs predictive analysis." />
                <DropdownItem page="ensemble" currentPage={currentPage} navigateTo={navigateTo} title="Ensemble" description="Assembles the perfect team for your project." />
                <DropdownItem page="spaeher" currentPage={currentPage} navigateTo={navigateTo} title="Scout" description="Conducts market analysis in real-time." />
                <DropdownItem page="experimentator" currentPage={currentPage} navigateTo={navigateTo} title="Experimenter" description="Creates and analyzes A/B tests for assets." />
                <DropdownItem page="berichterstatter" currentPage={currentPage} navigateTo={navigateTo} title="Reporter" description="Generates automated project reports." />
                <DropdownItem page="kalkulator" currentPage={currentPage} navigateTo={navigateTo} title="Calculator" description="Manages campaign budgets and tracks costs." />
            </NavDropdown>

            <NavDropdown title="Creation & Content">
                <DropdownItem page="visionar" currentPage={currentPage} navigateTo={navigateTo} title="Visionary" description="Generates visual assets from text." />
                <DropdownItem page="animator" currentPage={currentPage} navigateTo={navigateTo} title="Animator" description="Brings static images to life." />
                <DropdownItem page="konversator" currentPage={currentPage} navigateTo={navigateTo} title="Conversator" description="AI marketing consultant for brainstorming." />
                <DropdownItem page="personalisator" currentPage={currentPage} navigateTo={navigateTo} title="Personalizer" description="Adapts content for target audiences." />
                <DropdownItem page="resonator" currentPage={currentPage} navigateTo={navigateTo} title="Resonator" description="Generates platform-specific social media posts." />
                <DropdownItem page="kolorit" currentPage={currentPage} navigateTo={navigateTo} title="Colorist" description="Designs a complete brand style guide." />
                <DropdownItem page="baumeister" currentPage={currentPage} navigateTo={navigateTo} title="Architect" description="Designs and visualizes landing page structures." />
                <DropdownItem page="emailmarketing" currentPage={currentPage} navigateTo={navigateTo} title="E-Mail Marketing" description="Creates professional email campaigns with AI." />
            </NavDropdown>

            <NavDropdown title="Automation & Process">
                <DropdownItem page="conductor" currentPage={currentPage} navigateTo={navigateTo} title="Orchestrator" description="Orchestrates AI agents to achieve goals." />
                <DropdownItem page="sequenzer" currentPage={currentPage} navigateTo={navigateTo} title="Sequencer" description="Designs multi-stage email drip campaigns." />
                <DropdownItem page="taktgeber" currentPage={currentPage} navigateTo={navigateTo} title="Pacesetter" description="Plans strategic appointments and interactions." />
                <DropdownItem page="publisher" currentPage={currentPage} navigateTo={navigateTo} title="Publisher" description="Schedules and visualizes content publishing." />
            </NavDropdown>

            <NavDropdown title="Communication">
                <DropdownItem page="diplomat" currentPage={currentPage} navigateTo={navigateTo} title="Diplomat" description="Formulates strategic responses to emails." />
                <DropdownItem page="chronist" currentPage={currentPage} navigateTo={navigateTo} title="Chronicler" description="Manages contacts and interactions (CRM)." />
                <DropdownItem page="leadinbox" currentPage={currentPage} navigateTo={navigateTo} title="Lead Inbox" description="Incoming leads from the Mirrou website contact form." />
                <DropdownItem page="gespraechsleiter" currentPage={currentPage} navigateTo={navigateTo} title="Negotiator" description="Demonstrates AI collaboration in meetings." />
                <DropdownItem page="auditorium" currentPage={currentPage} navigateTo={navigateTo} title="Auditorium" description="Central review center for creative approvals." />
            </NavDropdown>

            <NavDropdown title="System & Knowledge">
                 <DropdownItem page="nexus" currentPage={currentPage} navigateTo={navigateTo} title="Nexus" description="Searches the entire knowledge of the Project OS." />
                <DropdownItem page="prometheus" currentPage={currentPage} navigateTo={navigateTo} title="Prometheus" description="Answers system-wide, strategic questions." />
                <DropdownItem page="systemaudit" currentPage={currentPage} navigateTo={navigateTo} title="System Audit" description="Interactive status report of the Project OS." />
                <DropdownItem page="akademie" currentPage={currentPage} navigateTo={navigateTo} title="Academy" description="The central knowledge base and learning platform." />
                <DropdownItem page="markenwaechter" currentPage={currentPage} navigateTo={navigateTo} title="Brand Guardian" description="Defines and verifies brand guidelines." />
                <DropdownItem page="brandingkit" currentPage={currentPage} navigateTo={navigateTo} title="Branding Kit" description="High-end identity guidelines and assets." />
                <DropdownItem page="interimmanager" currentPage={currentPage} navigateTo={navigateTo} title="Interim Manager" description="Reads the strategic report of the Interim Manager." />
                <DropdownItem page="statusbericht" currentPage={currentPage} navigateTo={navigateTo} title="Status Report" description="Reads the impact report of the Project OS." />
            </NavDropdown>
            
            {isSecretMode && <NavLink page="secret" currentPage={currentPage} navigateTo={navigateTo} isTopLevel>AURORA</NavLink>}
        </nav>
        
        <div className="flex items-center gap-4">
            {userProfile && (
                 <div className="hidden lg:flex flex-col items-end text-right">
                    <span className="text-xs font-bold text-white">{userProfile.name}</span>
                    <span className="text-[10px] text-purple-400 uppercase tracking-wider">{userProfile.role}</span>
                </div>
            )}
            
            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => navigateTo('settings')} className="text-xs text-white border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
                  Settings
                </button>
                <button onClick={logout} className="text-xs text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full hover:bg-red-900/20 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => navigateTo('auth')} className="text-xs text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full hover:bg-green-900/20 transition-colors">
                Initialize Access
              </button>
            )}

            <button onClick={onOpenCommandBar} className="group flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-full hover:border-white/20 transition-colors">
                <CommandControlIcon />
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors hidden lg:inline">Command Line</span>
                <span className="text-xs text-gray-500 hidden lg:inline">⌘K</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
