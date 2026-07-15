import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Phone,
  Envelope,
  ChartBar,
  SquaresFour,
  List,
} from '@phosphor-icons/react';
import SearchBar from '../components/SearchBar';
import GlassCard from '../components/GlassCard';
import { getCaptains, getTurnout, searchCaptains } from '../lib/data';
import type { Captain, Turnout } from '../types';

export default function PrecinctsPage() {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [turnout, setTurnout] = useState<Turnout[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    Promise.all([getCaptains(), getTurnout()])
      .then(([c, t]) => {
        setCaptains(c);
        setTurnout(t);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => searchCaptains(captains, query),
    [captains, query],
  );

  const getTurnoutForPrecinct = (precinct: number): Turnout | undefined =>
    turnout.find((t) => t.precinct === precinct);

  const uniquePrecincts = useMemo(
    () => [...new Set(captains.map((c) => c.precinct))].sort((a, b) => a - b),
    [captains],
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">Precinct Captains</h1>
        <p className="text-sm text-text-muted mt-1">
          {captains.length} captains across {uniquePrecincts.length} precincts — card or table view
        </p>
      </div>

      {/* Search + View Toggle */}
      <section className="sticky top-0 z-30 bg-surface-50/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by precinct number or captain name..."
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'card'
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
              aria-label="Card view"
            >
              <SquaresFour weight="regular" className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
              aria-label="Table view"
            >
              <List weight="regular" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse space-y-3">
                <div className="h-5 bg-surface-200/60 rounded w-2/3" />
                <div className="h-3 bg-surface-200/40 rounded w-1/3" />
                <div className="h-3 bg-surface-200/40 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <User weight="thin" className="h-16 w-16 text-text-muted/30 mb-6" />
            <h3 className="text-xl font-medium text-text-primary mb-2">
              No captains found
            </h3>
            <p className="text-text-muted max-w-md">
              Try adjusting your search by precinct number or captain name.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table view */
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-sm">
              <thead className="bg-surface-100/80">
                <tr className="text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-medium">Precinct</th>
                  <th className="text-left py-3 px-4 font-medium">Captain</th>
                  <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">
                    Polling Location
                  </th>
                  <th className="text-left py-3 px-4 font-medium hidden md:table-cell">
                    Contact
                  </th>
                  <th className="text-right py-3 px-4 font-medium hidden lg:table-cell">
                    Turnout
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((captain, idx) => {
                  const t = getTurnoutForPrecinct(captain.precinct);
                  return (
                    <motion.tr
                      key={`${captain.precinct}-${captain.name}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-surface-100/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-accent font-medium">
                          P{captain.precinct.toString().padStart(2, '0')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-primary font-medium">
                        {captain.name}
                      </td>
                      <td className="py-3 px-4 text-text-secondary hidden sm:table-cell">
                        {captain.polling_location}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {captain.email && (
                            <a
                              href={`mailto:${captain.email}`}
                              className="text-text-muted hover:text-accent transition-colors"
                              aria-label="Email"
                            >
                              <Envelope weight="regular" className="h-4 w-4" />
                            </a>
                          )}
                          {captain.phone && (
                            <a
                              href={`tel:${captain.phone.replace(/[^\d+]/g, '')}`}
                              className="text-text-muted hover:text-accent transition-colors"
                              aria-label="Phone"
                            >
                              <Phone weight="regular" className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right hidden lg:table-cell">
                        {t ? (
                          <div className="flex items-center justify-end gap-2">
                            <ChartBar
                              weight="regular"
                              className="h-3.5 w-3.5 text-text-muted"
                            />
                            <span className="text-text-secondary">
                              {t.turnout_pct}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-text-muted">&mdash;</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Card view — 2 columns */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((captain, idx) => {
              const t = getTurnoutForPrecinct(captain.precinct);
              return (
                <motion.div
                  key={`${captain.precinct}-${captain.name}`}
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
                          {captain.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="pill bg-accent/10 text-accent border border-accent/20 font-mono text-xs">
                            P{captain.precinct.toString().padStart(2, '0')}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-text-muted">
                            <MapPin weight="regular" className="h-3 w-3" />
                            {captain.polling_location}
                          </span>
                        </div>
                      </div>
                      {t && (
                        <div className="flex-shrink-0 text-right">
                          <div className="text-lg font-semibold text-text-primary">
                            {t.turnout_pct}%
                          </div>
                          <div className="text-[10px] text-text-muted uppercase">
                            Turnout
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                      {captain.email && (
                        <a
                          href={`mailto:${captain.email}`}
                          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
                        >
                          <Envelope weight="regular" className="h-3.5 w-3.5" />
                          {captain.email}
                        </a>
                      )}
                      {captain.phone && (
                        <a
                          href={`tel:${captain.phone.replace(/[^\d+]/g, '')}`}
                          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
                        >
                          <Phone weight="regular" className="h-3.5 w-3.5" />
                          {captain.phone}
                        </a>
                      )}
                    </div>
                    {t && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-4 text-xs text-text-muted">
                        <span>Registered: {t.registered_voters.toLocaleString()}</span>
                        <span>Ballots: {t.ballots_cast.toLocaleString()}</span>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
