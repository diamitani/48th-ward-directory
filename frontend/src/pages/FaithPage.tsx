import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Church,
  MapPin,
  Globe,
  Phone,
  Users,
} from '@phosphor-icons/react';
import SearchBar from '../components/SearchBar';
import GlassCard from '../components/GlassCard';
import { getReligious, searchReligious } from '../lib/data';
import type { Religious } from '../types';

export default function FaithPage() {
  const [items, setItems] = useState<Religious[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getReligious()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => searchReligious(items, query),
    [items, query],
  );

  const religions = useMemo(
    () => [...new Set(items.map((r) => r.religion))].sort(),
    [items],
  );

  return (
    <div className="min-h-[100dvh]">
      {/* Hero */}
      <section className="relative grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-16 pt-24 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 pill bg-chicago-red/10 text-chicago-red border border-chicago-red/20">
            <Church weight="fill" className="h-3 w-3" />
            <span>48th Ward</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-text-primary">
            Faith &
            <br />
            <span className="font-semibold text-accent">Worship</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-lg leading-relaxed">
            {items.length} religious institutions serving communities across the
            48th Ward.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-4">
          <div className="glass-card p-6 space-y-3">
            <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider">
              <Users weight="regular" className="h-3.5 w-3.5" />
              Traditions
            </div>
            <div className="flex flex-wrap gap-2">
              {religions.map((rel) => {
                const count = items.filter((r) => r.religion === rel).length;
                return (
                  <span
                    key={rel}
                    className="pill bg-surface-200/60 text-text-secondary"
                  >
                    {rel} ({count})
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="sticky top-[72px] z-30 bg-surface-50/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by name, religion, or address..."
          />
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse space-y-3">
                <div className="h-5 bg-surface-200/60 rounded w-2/3" />
                <div className="h-3 bg-surface-200/40 rounded w-1/2" />
                <div className="h-3 bg-surface-200/40 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Church
              weight="thin"
              className="h-16 w-16 text-text-muted/30 mb-6"
            />
            <h3 className="text-xl font-medium text-text-primary mb-2">
              No institutions found
            </h3>
            <p className="text-text-muted max-w-md">
              Try adjusting your search to find religious institutions in the
              48th Ward.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.name + item.address}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: idx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <GlassCard hover className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-text-primary">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="pill bg-accent/10 text-accent border border-accent/20">
                          {item.religion}
                        </span>
                        {item.denomination && (
                          <span className="pill bg-surface-200/60 text-text-secondary">
                            {item.denomination}
                          </span>
                        )}
                        <span className="font-mono text-xs text-text-muted/60">
                          {item.precinct}
                        </span>
                      </div>
                    </div>
                  </div>
                  {item.address && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary">
                      <MapPin
                        weight="regular"
                        className="h-3.5 w-3.5 text-text-muted"
                      />
                      {item.address}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-white/5">
                    {item.phone && (
                      <a
                        href={`tel:${item.phone.replace(/[^\d+]/g, '')}`}
                        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
                      >
                        <Phone weight="regular" className="h-3.5 w-3.5" />
                        {item.phone}
                      </a>
                    )}
                    {item.website && (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
                      >
                        <Globe weight="regular" className="h-3.5 w-3.5" />
                        Website
                      </a>
                    )}
                  </div>
                  {(item.leader || item.leader_title) && (
                    <div className="mt-3 pt-3 border-t border-white/5 text-xs text-text-muted">
                      {item.leader_title && (
                        <span className="text-text-muted/70">
                          {item.leader_title}:{' '}
                        </span>
                      )}
                      {item.leader || 'Unknown'}
                    </div>
                  )}
                  {item.community_programs && (
                    <div className="mt-3 pt-3 border-t border-white/5 text-xs text-text-secondary">
                      {item.community_programs}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
