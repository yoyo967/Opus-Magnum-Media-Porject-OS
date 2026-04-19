import React from 'react';
import { Navigate } from 'react-router-dom';
import { PORTFOLIO_APEX } from '../data/portfolio-v2';

// Legacy-Einstiegspunkt: das Portfolio lebt ab Canonical v1.6 unter /portfolio
// als eigenständige APEX/Pillar/Cluster-Struktur. Alte State-Navigation
// (currentPage === 'aioperator') wird hierher kanonisch umgeleitet.
const AIOperator: React.FC<{ navigateTo: (page: string) => void }> = () => (
    <Navigate to={PORTFOLIO_APEX.path} replace />
);

export default AIOperator;
