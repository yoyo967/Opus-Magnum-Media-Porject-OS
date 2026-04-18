
import React from 'react';
import { EmailEditor } from '../components/EmailEditor';

interface EmailMarketingProps {
  navigateTo: (page: string) => void;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ navigateTo }) => {

    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center no-print">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">E-Mail Marketing</h1>
                <p className="mt-2 text-[#888888] max-w-2xl mx-auto">
                    Entwerfen Sie professionelle E-Mail-Kampagnen mit KI-Unterstützung. Geben Sie Ihr Ziel vor und lassen Sie die KI überzeugende Texte für Sie erstellen.
                </p>
            </header>
            <main>
                <EmailEditor navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default EmailMarketing;
