import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TasksProvider, useTasks } from './contexts/AppContext';
// Strukturelle Komponenten bleiben eager (auf jeder Seite sichtbar):
import Header from './components/Header';
import { SecondaryHeader } from './components/SecondaryHeader';
import Footer from './components/Footer';
import { CommandBar } from './components/CommandBar';
import { Toast } from './components/Toast';
import LoadingScreen from './components/LoadingScreen';

// Lazy-loaded Seiten/Routen — jede Seite lädt nur ihr eigenes JS (Code-Splitting, P1.3).
const PortfolioApp = React.lazy(() => import('./pages/portfolio/PortfolioApp'));
const Home = React.lazy(() => import('./pages/Home'));
const Campaign = React.lazy(() => import('./pages/Campaign'));
const Meisterwerk = React.lazy(() => import('./components/Meisterwerk'));
const Visionar = React.lazy(() => import('./pages/Visionar'));
const Stratege = React.lazy(() => import('./pages/Stratege'));
const Konversator = React.lazy(() => import('./pages/Konversator'));
const Auditor = React.lazy(() => import('./pages/Auditor'));
const Animator = React.lazy(() => import('./pages/Animator'));
const Dirigent = React.lazy(() => import('./pages/Dirigent'));
const Secret = React.lazy(() => import('./pages/Secret'));
const Masterplan = React.lazy(() => import('./pages/Masterplan'));
const Einreichung = React.lazy(() => import('./pages/Einreichung'));
const Personalisator = React.lazy(() => import('./pages/Personalisator'));
const Orakel = React.lazy(() => import('./pages/Orakel'));
const Mediathek = React.lazy(() => import('./pages/Mediathek'));
const Akademie = React.lazy(() => import('./pages/Akademie'));
const Observatorium = React.lazy(() => import('./pages/Observatorium'));
const Conductor = React.lazy(() => import('./pages/Conductor'));
const Publisher = React.lazy(() => import('./pages/Publisher'));
const Persona = React.lazy(() => import('./pages/Persona'));
const Auditorium = React.lazy(() => import('./pages/Auditorium'));
const Analytiker = React.lazy(() => import('./pages/Analytiker'));
const Markenwaechter = React.lazy(() => import('./pages/Markenwaechter'));
const Berichterstatter = React.lazy(() => import('./pages/Berichterstatter'));
const Nexus = React.lazy(() => import('./pages/Nexus'));
const EmailMarketing = React.lazy(() => import('./pages/EmailMarketing'));
const Kalkulator = React.lazy(() => import('./pages/Kalkulator'));
const Experimentator = React.lazy(() => import('./pages/Experimentator'));
const Prometheus = React.lazy(() => import('./pages/Prometheus'));
const Resonator = React.lazy(() => import('./pages/Resonator'));
const Gespraechsleiter = React.lazy(() => import('./pages/Gespraechsleiter'));
const Kolorit = React.lazy(() => import('./pages/Kolorit'));
const Ensemble = React.lazy(() => import('./pages/Ensemble'));
const Diplomat = React.lazy(() => import('./pages/Diplomat'));
const Chronist = React.lazy(() => import('./pages/Chronist'));
const Sequenzer = React.lazy(() => import('./pages/Sequenzer'));
const Taktgeber = React.lazy(() => import('./pages/Taktgeber'));
const Spaeher = React.lazy(() => import('./pages/Spaeher'));
const Baumeister = React.lazy(() => import('./pages/Baumeister'));
const InterimManager = React.lazy(() => import('./pages/InterimManager'));
const StatusBericht = React.lazy(() => import('./pages/StatusBericht'));
const SystemAudit = React.lazy(() => import('./pages/SystemAudit'));
const GrantBook = React.lazy(() => import('./pages/GrantBook'));
const Legal = React.lazy(() => import('./pages/Legal'));
const BrandingKit = React.lazy(() => import('./pages/BrandingKit'));
const AIOperator = React.lazy(() => import('./pages/AIOperator'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Settings = React.lazy(() => import('./pages/Settings'));
const MirrouBenchmarks = React.lazy(() => import('./pages/MirrouBenchmarks'));
const LeadInbox = React.lazy(() => import('./pages/LeadInbox'));

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
  const { authError, user, geminiApiKey, toolInput } = useTasks();

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    // If not logged in and not on auth page, redirect to auth
    if (!user && currentPage !== 'auth') {
        setCurrentPage('auth');
    }
    // If logged in but no API key and not on auth/settings, redirect to settings
    else if (user && !geminiApiKey && currentPage !== 'settings' && currentPage !== 'auth') {
        setCurrentPage('settings');
    }
    // If logged in and on auth, go home
    else if (user && geminiApiKey && currentPage === 'auth') {
        setCurrentPage('home');
    }
  }, [user, geminiApiKey, currentPage]);

  // L3-Verkettung: "An nächstes Tool senden" (setToolInput) navigiert automatisch dorthin.
  React.useEffect(() => {
    if (toolInput && toolInput.tool) navigateTo(toolInput.tool);
  }, [toolInput]);

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
          <Suspense fallback={<LoadingScreen />}>
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
          {currentPage === 'mirroubenchmarks' && <MirrouBenchmarks navigateTo={navigateTo} />}
          {currentPage === 'leadinbox' && <LeadInbox navigateTo={navigateTo} />}
          {/* Legal Pages */}
          {currentPage === 'imprint' && <Legal type="imprint" navigateTo={navigateTo} />}
          {currentPage === 'privacy' && <Legal type="privacy" navigateTo={navigateTo} />}
          {currentPage === 'terms' && <Legal type="terms" navigateTo={navigateTo} />}
          {currentPage === 'ethics' && <Legal type="ethics" navigateTo={navigateTo} />}

          {/* Tenant & BYOK */}
          {currentPage === 'auth' && <Auth navigateTo={navigateTo} />}
          {currentPage === 'settings' && <Settings navigateTo={navigateTo} />}
          </Suspense>
        </main>

        <Footer navigateTo={navigateTo} />

        {isCommandBarOpen && <CommandBar isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} navigateTo={navigateTo} />}
      </div>
  );
};

export default function App() {
  return (
    <TasksProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/portfolio/*" element={<PortfolioApp />} />
          <Route path="*" element={<AppContent />} />
        </Routes>
      </Suspense>
    </TasksProvider>
  );
}
