
import React from 'react';

interface LegalProps {
    type: 'imprint' | 'privacy' | 'terms' | 'ethics';
    navigateTo: (page: string) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8 border-l-2 border-white/10 pl-6 py-2 hover:border-purple-500/50 transition-colors">
        <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
        <div className="text-sm text-gray-400 leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

const Legal: React.FC<LegalProps> = ({ type, navigateTo }) => {
    let title = "";
    let subtitle = "";
    let content = null;

    switch (type) {
        case 'imprint':
            title = "Impressum";
            subtitle = "Legal Disclosure / Anbieterkennzeichnung";
            content = (
                <>
                    <Section title="Angaben gemäß § 5 TMG">
                        <p>OPUS MAGNUM MEDIA<br/>Yahya Yildirim<br/>[Anschrift im DCI Framework]<br/>Berlin, Deutschland</p>
                    </Section>
                    <Section title="Kontakt">
                        <p>E-Mail: [Musteremail]<br/>Web: www.opus-magnum.media</p>
                    </Section>
                    <Section title="Akademischer Ursprung">
                        <p>Diese Plattform wurde im Rahmen der Weiterbildung zum Online Marketing Manager beim <b>Digital Career Institute (DCI)</b> als Abschlussprojekt entwickelt.</p>
                    </Section>
                    <Section title="Haftungsausschluss (Disclaimer)">
                        <p>Wir nutzen Google Cloud, Alphabet und DeepMind Infrastrukturen. Wir sind weder Partner noch offizieller Reseller dieser Dienste.</p>
                    </Section>
                </>
            );
            break;
        case 'privacy':
            title = "Privacy Policy (GDPR)";
            subtitle = "Datenschutzerklärung & Data Sovereignty";
            content = (
                <>
                    <Section title="1. Datenschutz auf einen Blick">
                        <p>Wir nutzen Google Cloud und Firebase für das Daten-Management. Alle personenbezogenen Daten werden nach EU-Standards verarbeitet.</p>
                    </Section>
                    <Section title="2. KI-Verarbeitung & Drittanbieter">
                        <p><strong>Gemini API (Google DeepMind):</strong> Eingabedaten werden an die Google Gemini API gesendet. Gemäß Enterprise-Richtlinien werden diese Daten nicht zum Training öffentlicher Modelle verwendet.</p>
                    </Section>
                    <Section title="3. Hosting">
                        <p>Die Website wird über Firebase Hosting (Google Ireland Limited) bereitgestellt.</p>
                    </Section>
                </>
            );
            break;
        case 'terms':
            title = "Terms of Service";
            subtitle = "Allgemeine Geschäftsbedingungen (AGB)";
            content = (
                <>
                    <Section title="1. Geltungsbereich">
                        <p>Diese AGB regeln die Nutzung des Projekt-Betriebssystems "The Neural Engine".</p>
                    </Section>
                    <Section title="2. Token Economy">
                        <p>Die Nutzung von KI-Ressourcen verbraucht "Credits". Diese haben keinen monetären Gegenwert außerhalb der Plattform.</p>
                    </Section>
                </>
            );
            break;
        case 'ethics':
            title = "AI Ethics Statement";
            subtitle = "Unsere Verpflichtung zu verantwortungsvoller KI";
            content = (
                <>
                    <Section title="Human-in-the-Loop">
                        <p>OPUS MAGNUM MEDIA folgt dem Prinzip, dass KI den Menschen erweitert, nicht ersetzt. Jede finale Veröffentlichung erfordert eine menschliche Verifizierung.</p>
                    </Section>
                    <Section title="Transparenz">
                        <p>Wir kennzeichnen KI-generierte Inhalte und arbeiten aktiv an der Vermeidung von algorithmischem Bias.</p>
                    </Section>
                </>
            );
            break;
    }

    return (
        <div className="container mx-auto px-6 py-16 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b border-white/10 pb-8">
                    <button onClick={() => navigateTo('home')} className="text-xs text-gray-500 hover:text-white mb-4 flex items-center gap-2 transition-colors">
                        ← BACK TO OS
                    </button>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-2">{title}</h1>
                    <p className="text-purple-400 font-mono text-sm uppercase tracking-widest">{subtitle}</p>
                </header>
                
                <div className="bg-[#111] rounded-lg border border-white/5 p-8 md:p-12 shadow-2xl animate-[fadeIn_0.5s_ease-out]">
                    {content}
                    
                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-600 font-mono">
                            DOCUMENT_ID: {type.toUpperCase()}_{new Date().getFullYear()}_V3.0<br/>
                            LAST_UPDATED: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Legal;
