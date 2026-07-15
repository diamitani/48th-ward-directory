import { useState } from 'react';
import { Phone, Globe, Envelope, MapPin, Storefront, Clock, CaretDown } from '@phosphor-icons/react';
import GlassCard from './GlassCard';
import type { Business } from '../types';
import DetailModal from './DetailModal';

interface BusinessCardProps {
  business: Business;
  onClick: () => void;
  index?: number;
}

export default function BusinessCard({ business, onClick, index = 0 }: BusinessCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const hasHours = business.hours && business.hours.trim().length > 0;
  const hasOwner = business.owner && business.owner.trim().length > 0;
  const hasExpandable = hasHours || hasOwner;

  const handleClick = () => {
    if (onClick) onClick();
    else setModalOpen(true);
  };

  return (
    <>
      <GlassCard hover className="p-5 md:p-6">
        <div className="flex flex-col gap-3" style={{ animationDelay: `${index * 50}ms` }}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3
                className="text-sm md:text-base font-medium text-[#e2e8f0] truncate cursor-pointer hover:text-[#22d3ee] transition-colors"
                onClick={handleClick}
              >
                {business.name}
              </h3>
              {business.address && (
                <div className="flex items-center gap-1.5 mt-1.5 text-[#64748b] text-xs">
                  <MapPin size={14} weight="light" className="flex-shrink-0" />
                  <span className="truncate">{business.address}</span>
                </div>
              )}
            </div>
            {business.category && (
              <span className="pill bg-[#22d3ee]/10 text-[#22d3ee] flex-shrink-0">
                {business.category}
              </span>
            )}
          </div>

          {business.neighborhood && (
            <div className="flex items-center gap-1.5 text-[#64748b] text-xs">
              <Storefront size={14} weight="light" className="flex-shrink-0" />
              <span>{business.neighborhood}</span>
              <span className="text-[#334155]">|</span>
              <span className="text-[#64748b]/60 font-mono text-[10px]">{business.precinct}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {business.phone && (
              <a
                href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-1.5 text-[#94a3b8] hover:text-[#22d3ee] transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <Phone size={14} weight="light" />
                {business.phone}
              </a>
            )}
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#94a3b8] hover:text-[#22d3ee] transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <Globe size={14} weight="light" />
                Website
              </a>
            )}
            {business.email && (
              <a
                href={`mailto:${business.email}`}
                className="flex items-center gap-1.5 text-[#94a3b8] hover:text-[#22d3ee] transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <Envelope size={14} weight="light" />
                Email
              </a>
            )}
          </div>

          {hasExpandable && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
                className="flex items-center gap-1.5 text-[#64748b] hover:text-[#94a3b8] transition-colors text-xs pt-1"
              >
                <CaretDown
                  size={12}
                  weight="bold"
                  className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                />
                {expanded ? 'Less details' : 'More details'}
              </button>
              {expanded && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {hasHours && (
                    <div className="flex items-start gap-2 text-xs text-[#94a3b8]">
                      <Clock size={14} weight="light" className="flex-shrink-0 mt-0.5 text-[#64748b]" />
                      <span className="whitespace-pre-line">{business.hours}</span>
                    </div>
                  )}
                  {hasOwner && (
                    <div className="text-xs text-[#94a3b8]">
                      <span className="text-[#64748b]">Owner: </span>
                      {business.owner}
                      {business.owner_phone && (
                        <span className="text-[#64748b]"> &middot; {business.owner_phone}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </GlassCard>

      {modalOpen && (
        <DetailModal business={business} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
