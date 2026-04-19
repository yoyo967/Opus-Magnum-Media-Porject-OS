import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { PillarPage } from '../../../components/portfolio/PillarPage';
import { getPillar, PORTFOLIO_APEX } from '../../../data/portfolio-v2';

// Generischer Pillar-Route: löst den Slug gegen die Pillar-Registry auf
// und rendert das PillarPage-Template. Unbekannte Slugs → Redirect zur APEX.
const PillarRoute: React.FC = () => {
    const { pillarSlug } = useParams<{ pillarSlug: string }>();
    const pillar = pillarSlug ? getPillar(pillarSlug) : undefined;

    if (!pillar) {
        return <Navigate to={PORTFOLIO_APEX.path} replace />;
    }

    return <PillarPage pillar={pillar} />;
};

export default PillarRoute;
