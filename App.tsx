
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PortfolioApp from './pages/portfolio/PortfolioApp';
import Header from './components/Header';
import { SecondaryHeader } from './components/SecondaryHeader';
import Footer from './components/Footer';
import Home from './pages/Home';
import Campaign from './pages/Campaign';
import Meisterwerk from './components/Meisterwerk';
import Visionar from './pages/Visionar';
import Stratege from './pages/Stratege';
import Konversator from './pages/Konversator';
import Auditor from './pages/Auditor';
import Animator from './pages/Animator';
import Dirigent from './pages/Dirigent';
import Secret from './pages/Secret';
import Masterplan from './pages/Masterplan';
import Einreichung from './pages/Einreichung';
import { TasksProvider, useTasks } from './contexts/AppContext';
import Personalisator from './pages/Personalisator';
import Orakel from './pages/Orakel';
import Mediathek from './pages/Mediathek';
import Akademie from './pages/Akademie';
import Observatorium from './pages/Observatorium';
import Conductor from './pages/Conductor';
import Publisher from './pages/Publisher';
import Persona from './pages/Persona';
import Auditorium from './pages/Auditorium';
import Analytiker from './pages/Analytiker';
import { CommandBar } from './components/CommandBar';
import Markenwaechter from './pages/Markenwaechter';
import Berichterstatter from './pages/Berichterstatter';
import Nexus from './pages/Nexus';
import EmailMarketing from './pages/EmailMarketing';
import Kalkulator from './pages/Kalkulator';
import Experimentator from './pages/Experimentator';
import Prometheus from './pages/Prometheus';
import Resonator from './pages/Resonator';
import Gespraechsleiter from './pages/Gespraechsleiter';
import Kolorit from './pages/Kolorit';
import Ensemble from './pages/Ensemble';
import Diplomat from './pages/Diplomat';
import Chronist from './pages/Chronist';
import Sequenzer from './pages/Sequenzer';
import Taktgeber from './pages/Taktgeber';
import Spaeher from './pages/Spaeher';
import Baumeister from './pages/Baumeister';
import InterimManager from './pages/InterimManager';
import StatusBericht from './pages/StatusBericht';
import SystemAudit from './pages/SystemAudit';
import GrantBook from './pages/GrantBook';
import Legal from './pages/Legal';
import BrandingKit from './pages/BrandingKit';
import AIOperator from './pages/AIOperator';
import { Toast } from './components/Toast';

const SystemBootNotification: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    React.useEffect(() => {
        const timer = setTimeout(onComplete, 3500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-black/80 backdrop-blur-md border border-green-500/30 text-green-400 px-6 py-2 rounded-md font-mono text-xs shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center gap-3 animate-[fadeIn_0.5s_ease-out]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>SYSTEM KERNEL v3.0 LOADED. COMPLIANCE MODULE ACTIVE.</span>
        </div>
    );
};

const AppContent = () => {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [isSecretMode, setIsSecretMode] = React.useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = React.useState(false);
  const [systemToast, setSystemToast] = React.useState<string | null>(null);
  const [showBootMsg, setShowBootMsg] = React.useState(true);
  const { authError } = useTasks();

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <div className="bg-[#0A0A0A] text-[#F5F5F5] antialiased selection:bg-purple-500/30 selection:text-white flex flex-col min-h-screen">
        {showBootMsg && !authError && <SystemBootNotification onComplete={() => setShowBootMsg(false)} />}
        {systemToast && <Toast message={systemToast} onClose={() => systemToast && setSystemToast(null)} />}
        
        <Header 
            navigateTo={navigateTo} 
            currentPage={currentPage} 
            onOpenCommandBar={() => setIsCommandBarOpen(true)}
            isSecretMode={isSecretMode}
        />
        
        <SecondaryHeader 
            currentPage={currentPage} 
            navigateTo={navigateTo}
        />
        
        <main key={currentPage} className="page-fade-in flex-grow">
          {currentPage === 'home' && <Home navigateTo={navigateTo} />}
          {currentPage === 'campaign' && <Campaign navigateTo={navigateTo} />}
          {currentPage === 'meisterwerk' && <Meisterwerk navigateTo={navigateTo} />}
          {currentPage === 'visionar' && <Visionar navigateTo={navigateTo} />}
          {currentPage === 'stratege' && <Stratege navigateTo={navigateTo} />}
          {currentPage === 'konversator' && <Konversator />}
          {currentPage === 'auditor' && <Auditor />}
          {currentPage === 'animator' && <Animator navigateTo={navigateTo} />}
          {currentPage === 'dirigent' && <Dirigent navigateTo={navigateTo} />}
          {currentPage === 'secret' && <Secret navigateTo={navigateTo} />}
          {currentPage === 'masterplan' && <Masterplan navigateTo={navigateTo} />}
          {currentPage === 'einreichung' && <Einreichung navigateTo={navigateTo} />}
          {currentPage === 'personalisator' && <Personalisator navigateTo={navigateTo} />}
          {currentPage === 'orakel' && <Orakel navigateTo={navigateTo} />}
          {currentPage === 'mediathek' && <Mediathek navigateTo={navigateTo} />}
          {currentPage === 'akademie' && <Akademie />}
          {currentPage === 'observatorium' && <Observatorium navigateTo={navigateTo} />}
          {currentPage === 'conductor' && <Conductor navigateTo={navigateTo} />}
          {currentPage === 'publisher' && <Publisher navigateTo={navigateTo} />}
          {currentPage === 'persona' && <Persona navigateTo={navigateTo} />}
          {currentPage === 'auditorium' && <Auditorium navigateTo={navigateTo} />}
          {currentPage === 'analytiker' && <Analytiker navigateTo={navigateTo} />}
          {currentPage === 'markenwaechter' && <Markenwaechter />}
          {currentPage === 'berichterstatter' && <Berichterstatter navigateTo={navigateTo} />}
          {currentPage === 'nexus' && <Nexus navigateTo={navigateTo} />}
          {currentPage === 'emailmarketing' && <EmailMarketing navigateTo={navigateTo} />}
          {currentPage === 'kalkulator' && <Kalkulator navigateTo={navigateTo} />}
          {currentPage === 'experimentator' && <Experimentator navigateTo={navigateTo} />}
          {currentPage === 'prometheus' && <Prometheus navigateTo={navigateTo} />}
          {currentPage === 'resonator' && <Resonator navigateTo={navigateTo} />}
          {currentPage === 'gespraechsleiter' && <Gespraechsleiter navigateTo={navigateTo} />}
          {currentPage === 'kolorit' && <Kolorit />}
          {currentPage === 'ensemble' && <Ensemble />}
          {currentPage === 'diplomat' && <Diplomat />}
          {currentPage === 'chronist' && <Chronist />}
          {currentPage === 'sequenzer' && <Sequenzer navigateTo={navigateTo} />}
          {currentPage === 'taktgeber' && <Taktgeber navigateTo={navigateTo} />}
          {currentPage === 'spaeher' && <Spaeher navigateTo={navigateTo} />}
          {currentPage === 'baumeister' && <Baumeister navigateTo={navigateTo} />}
          {currentPage === 'interimmanager' && <InterimManager navigateTo={navigateTo} />}
          {currentPage === 'statusbericht' && <StatusBericht navigateTo={navigateTo} />}
          {currentPage === 'systemaudit' && <SystemAudit navigateTo={navigateTo} />}
          {currentPage === 'grantbook' && <GrantBook navigateTo={navigateTo} onComplete={() => setIsSecretMode(true)} />}
          {currentPage === 'brandingkit' && <BrandingKit navigateTo={navigateTo} />}
          {currentPage === 'aioperator' && <AIOperator navigateTo={navigateTo} />}
          {/* Legal Pages */}
          {currentPage === 'imprint' && <Legal type="imprint" navigateTo={navigateTo} />}
          {currentPage === 'privacy' && <Legal type="privacy" navigateTo={navigateTo} />}
          {currentPage === 'terms' && <Legal type="terms" navigateTo={navigateTo} />}
          {currentPage === 'ethics' && <Legal type="ethics" navigateTo={navigateTo} />}
        </main>
        
        <Footer navigateTo={navigateTo} />
        
        {isCommandBarOpen && <CommandBar isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} navigateTo={navigateTo} />}
      </div>
  );
};

export default function App() {
  return (
    <TasksProvider>
      <Routes>
        <Route path="/portfolio/*" element={<PortfolioApp />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </TasksProvider>
  );
}
