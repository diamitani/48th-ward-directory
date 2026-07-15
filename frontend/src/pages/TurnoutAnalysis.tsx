import { useState, useEffect, useMemo } from 'react';
import { ArrowUp, ArrowDown, Minus } from '@phosphor-icons/react';
import { getTurnout } from '../lib/data';
import type { Turnout } from '../types';

const WARD_AVG_TURNOUT = 54.8; // approximate

export default function TurnoutAnalysis() {
  const [turnout, setTurnout] = useState<Turnout[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<keyof Turnout>('turnout_pct');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    getTurnout()
      .then(setTurnout)
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    const arr = [...turnout];
    arr.sort((a, b) => {
      const va = a[sortKey] as number;
      const vb = b[sortKey] as number;
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return arr;
  }, [turnout, sortKey, sortDir]);

  const handleSort = (key: keyof Turnout) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const stats = useMemo(() => {
    if (turnout.length === 0) return { avg: 0, max: 0, min: 0, totalReg: 0, totalCast: 0 };
    const avg = turnout.reduce((s, t) => s + t.turnout_pct, 0) / turnout.length;
    const max = Math.max(...turnout.map((t) => t.turnout_pct));
    const min = Math.min(...turnout.map((t) => t.turnout_pct));
    const totalReg = turnout.reduce((s, t) => s + t.registered_voters, 0);
    const totalCast = turnout.reduce((s, t) => s + t.ballots_cast, 0);
    return { avg, max, min, totalReg, totalCast };
  }, [turnout]);

  const SortIcon = ({ field }: { field: keyof Turnout }) => {
    if (sortKey !== field) return <Minus className="h-3 w-3 opacity-30" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">Turnout Analysis</h1>
        <p className="text-sm text-text-muted mt-1">
          Voter turnout by precinct — registered voters, ballots cast, and turnout percentage
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Avg Turnout', value: `${stats.avg.toFixed(1)}%`, sub: 'across all precincts' },
          { label: 'Highest', value: `${stats.max.toFixed(1)}%`, sub: 'best precinct', color: 'text-success' },
          { label: 'Lowest', value: `${stats.min.toFixed(1)}%`, sub: 'needs attention', color: 'text-danger' },
          { label: 'Registered', value: stats.totalReg.toLocaleString(), sub: 'total voters' },
          { label: 'Ballots Cast', value: stats.totalCast.toLocaleString(), sub: `${((stats.totalCast / stats.totalReg) * 100).toFixed(1)}% overall` },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="text-[11px] uppercase tracking-wider text-text-muted font-medium mb-1">
              {s.label}
            </div>
            <div className={`text-2xl font-semibold ${s.color || 'text-text-primary'}`}>{s.value}</div>
            <div className="text-[11px] text-text-muted mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Table with bar visualization */}
      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Precinct</th>
              <th className="cursor-pointer select-none" onClick={() => handleSort('registered_voters')}>
                <span className="flex items-center gap-1">Registered <SortIcon field="registered_voters" /></span>
              </th>
              <th className="cursor-pointer select-none" onClick={() => handleSort('ballots_cast')}>
                <span className="flex items-center gap-1">Ballots Cast <SortIcon field="ballots_cast" /></span>
              </th>
              <th className="cursor-pointer select-none" onClick={() => handleSort('turnout_pct')}>
                <span className="flex items-center gap-1">Turnout % <SortIcon field="turnout_pct" /></span>
              </th>
              <th>vs Ward Avg</th>
              <th>Visual</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => {
              const diff = t.turnout_pct - WARD_AVG_TURNOUT;
              const isLow = t.turnout_pct < 40;
              const isHigh = t.turnout_pct > 65;
              return (
                <tr key={t.precinct}>
                  <td className="font-medium text-text-primary">P{t.precinct}</td>
                  <td>{t.registered_voters.toLocaleString()}</td>
                  <td>{t.ballots_cast.toLocaleString()}</td>
                  <td>
                    <span className={`font-semibold ${isLow ? 'text-danger' : isHigh ? 'text-success' : 'text-text-primary'}`}>
                      {t.turnout_pct.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs ${diff >= 0 ? 'text-success' : 'text-danger'}`}>
                      {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <div className="w-full max-w-[120px] h-2 rounded-full bg-surface-300 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isLow ? 'bg-danger' : isHigh ? 'bg-success' : 'bg-accent'}`}
                        style={{ width: `${Math.min(t.turnout_pct, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
