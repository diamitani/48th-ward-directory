import { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  Envelope,
  MapPin,
  CheckCircle,
  WarningCircle,
  XCircle,
  Export as ExportIcon,
} from '@phosphor-icons/react';
import { getCaptains, searchCaptains } from '../lib/data';
import type { Captain } from '../types';

function getCaptainStatus(c: Captain): 'active' | 'needs-followup' | 'unresponsive' {
  const notes = (c.notes || '').toLowerCase();
  const name = c.name.toLowerCase();
  if (notes.includes('not responded') || notes.includes('three times')) return 'unresponsive';
  if (name.includes('?')) return 'needs-followup';
  if (notes.includes('attended') || notes.includes('meeting')) return 'active';
  if (c.google_group && c.email) return 'active';
  if (c.email) return 'needs-followup';
  return 'unresponsive';
}

function statusBadge(status: string) {
  switch (status) {
    case 'active':
      return { icon: CheckCircle, className: 'badge badge-success', label: 'Active' };
    case 'needs-followup':
      return { icon: WarningCircle, className: 'badge badge-warning', label: 'Follow-up' };
    case 'unresponsive':
      return { icon: XCircle, className: 'badge badge-danger', label: 'Unresponsive' };
    default:
      return { icon: WarningCircle, className: 'badge badge-warning', label: 'Unknown' };
  }
}

export default function CaptainRoster() {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'needs-followup' | 'unresponsive'>('all');

  useEffect(() => {
    getCaptains()
      .then(setCaptains)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let results = searchCaptains(captains, query);
    if (statusFilter !== 'all') {
      results = results.filter((c) => getCaptainStatus(c) === statusFilter);
    }
    return results;
  }, [captains, query, statusFilter]);

  const stats = useMemo(() => ({
    total: captains.length,
    active: captains.filter((c) => getCaptainStatus(c) === 'active').length,
    followup: captains.filter((c) => getCaptainStatus(c) === 'needs-followup').length,
    unresponsive: captains.filter((c) => getCaptainStatus(c) === 'unresponsive').length,
  }), [captains]);

  const handleExportCSV = () => {
    const headers = ['Name', 'Precinct', 'Polling Location', 'Phone', 'Email', 'Status', 'Notes'];
    const rows = filtered.map((c) => [
      c.name.replace(/\?/g, ''),
      String(c.precinct),
      c.polling_location,
      c.phone || '',
      c.email || '',
      getCaptainStatus(c),
      c.notes || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '48th-ward-captains.csv';
    a.click();
    URL.revokeObjectURL(url);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Captain Roster</h1>
          <p className="text-sm text-text-muted mt-1">{stats.total} captains across precincts</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary border border-surface-border hover:text-text-primary hover:border-surface-400 transition-colors"
        >
          <ExportIcon className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats row */}
      <div className="flex gap-4">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Active', value: stats.active, color: 'text-success' },
          { label: 'Follow-up', value: stats.followup, color: 'text-warning' },
          { label: 'Unresponsive', value: stats.unresponsive, color: 'text-danger' },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() =>
              setStatusFilter(
                statusFilter === s.label.toLowerCase()
                  ? 'all'
                  : (s.label.toLowerCase() as typeof statusFilter),
              )
            }
            className={`stat-card flex-1 text-left cursor-pointer transition-colors ${
              statusFilter === s.label.toLowerCase() ? 'border-accent/30' : ''
            }`}
          >
            <div className={`text-2xl font-semibold ${s.color || 'text-text-primary'}`}>
              {s.value}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-text-muted mt-1">
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by name, precinct, or polling location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-100 border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:border-accent/50 focus:ring-1 focus:ring-accent/30 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="stat-card overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-muted">
            No captains match your filters.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Captain</th>
                <th>Precinct</th>
                <th>Polling Location</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const status = getCaptainStatus(c);
                const badge = statusBadge(status);
                return (
                  <tr key={i}>
                    <td className="font-medium text-text-primary">{c.name.replace(/\?/g, '')}</td>
                    <td>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-accent" />
                        {c.precinct}
                      </span>
                    </td>
                    <td className="text-text-muted">{c.polling_location}</td>
                    <td>
                      <div className="space-y-0.5">
                        {c.phone && (
                          <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-accent hover:underline text-xs">
                            <Phone className="h-3 w-3" /> {c.phone}
                          </a>
                        )}
                        {c.email && (
                          <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-text-secondary hover:text-accent text-xs">
                            <Envelope className="h-3 w-3" /> {c.email}
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={badge.className}>
                        <badge.icon className="h-3 w-3" weight="fill" />
                        <span className="ml-1">{badge.label}</span>
                      </span>
                    </td>
                    <td className="text-xs text-text-muted max-w-[200px] truncate">
                      {c.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
