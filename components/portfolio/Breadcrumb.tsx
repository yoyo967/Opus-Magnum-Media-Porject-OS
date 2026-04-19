import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
    label: string;
    to?: string;
}

interface BreadcrumbProps {
    crumbs: Crumb[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => (
    <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.25em] uppercase"
    >
        {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
                <React.Fragment key={`${crumb.label}-${i}`}>
                    {crumb.to && !isLast ? (
                        <Link
                            to={crumb.to}
                            className="text-gray-500 hover:text-[#A855F7] transition-colors"
                        >
                            {crumb.label}
                        </Link>
                    ) : (
                        <span className={isLast ? 'text-[#F5F5F5]' : 'text-gray-500'}>
                            {crumb.label}
                        </span>
                    )}
                    {!isLast && (
                        <ChevronRight
                            className="w-3 h-3 text-gray-700"
                            aria-hidden
                        />
                    )}
                </React.Fragment>
            );
        })}
    </nav>
);

export default Breadcrumb;
