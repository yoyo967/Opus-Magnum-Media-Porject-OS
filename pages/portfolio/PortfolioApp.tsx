import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { PortfolioShell } from '../../components/portfolio/PortfolioShell';
import { ApexOverview } from './ApexOverview';
import PillarRoute from './pillars/PillarRoute';
import ClusterRoute from './pillars/ClusterRoute';
import { PORTFOLIO_APEX, PORTFOLIO_PILLARS, getCluster } from '../../data/portfolio-v2';
import type { Crumb } from '../../components/portfolio/Breadcrumb';

// PortfolioApp — Router-Knoten für /portfolio/*.
// APEX, Pillar-Pages und Cluster-Pages teilen die PortfolioShell.
// Breadcrumb wird aus der URL-Tiefe abgeleitet (OS › Portfolio › Pillar › Cluster).
const PortfolioApp: React.FC = () => {
    const location = useLocation();
    const segments = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);

    const crumbs: Crumb[] = [
        { label: 'OS', to: '/' },
        { label: 'Portfolio', to: PORTFOLIO_APEX.path },
    ];

    // segments = ['portfolio'] | ['portfolio', pillarSlug] | ['portfolio', pillarSlug, clusterSlug]
    if (segments[1]) {
        const pillar = PORTFOLIO_PILLARS.find((p) => p.slug === segments[1]);
        if (pillar) {
            const isCluster = Boolean(segments[2]);
            crumbs.push({ label: pillar.label, to: isCluster ? pillar.path : undefined });
            if (isCluster) {
                const cluster = getCluster(pillar.slug, segments[2]);
                if (cluster) crumbs.push({ label: cluster.label });
            }
        }
    }

    return (
        <PortfolioShell crumbs={crumbs}>
            <Routes>
                <Route index element={<ApexOverview />} />
                <Route path=":pillarSlug" element={<PillarRoute />} />
                <Route path=":pillarSlug/:clusterSlug" element={<ClusterRoute />} />
                <Route path="*" element={<Navigate to={PORTFOLIO_APEX.path} replace />} />
            </Routes>
        </PortfolioShell>
    );
};

export default PortfolioApp;
