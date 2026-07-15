import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  SquaresFour,
  ChartBar,
  Buildings,
  WarningCircle,
  CheckCircle,
  ArrowRight,
  Phone,
} from '@phosphor-icons/react';
import { getCaptains, getTurnout, getBusinesses } from '../lib/data';
import type { Captain, Turnout } from '../types';

const TOTAL_PRECINCTS = 35;

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

export default function DashboardHome() {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [turnout, setTurnout] = useState<Turnout[]>([]);
  const [businessCount, setBusinessCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCaptains(), getTurnout(), getBusinesses()])
      .then(([c, t, b]) => {
        setCaptains(c);
        setTurnout(t);
        setBusinessCount(b.length);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const precinctsWithCaptains = new Set(captains.map((c) => c.precinct));
    const activeCaptains = captains.filter((c) => getCaptainStatus(c) === 'active').length;
    const needsFollowup = captains.filter((c) => getCaptainStatus(c) === 'needs-followup').length;
    const avgTurnout = turnout.length > 0
      ? (turnout.reduce((sum, t) => sum + t.turnout_pct, 0) / turnout.length).toFixed(1)
      : '0';
    const coveredPrecincts = precinctsWithCaptains.size;
    const coveragePct = ((coveredPrecincts / TOTAL_PRECINCTS) * 100).toFixed(0);

    return {
      totalCaptains: captains.length,
      activeCaptains,
      needsFollowup,
      coveredPrecincts,
      coveragePct,
      avgTurnout,
      businessCount,
    };
  }, [captains, turnout, businessCount]);

  const precinctCoverage = useMemo(() => {
    const captainPrecincts = new Set(captains.map((c) => c.precinct));
    return Array.from({ length: TOTAL_PRECINCTS }, (_, i) => {
      const num = i + 1;
      const hasCaptain = captainPrecincts.has(num);
      const precinctCaptains = captains.filter((c) => c.precinct === num);
      const hasActive = precinctCaptains.some((c) => getCaptainStatus(c) === 'active');
      const hasUnconfirmed = precinctCaptains.some((c) => getCaptainStatus(c) === 'needs-followup');

      let status: 'active' | 'partial' | 'gap';
      if (hasActive) status = 'active';
      else if (hasCaptain || hasUnconfirmed) status = 'partial';
      else status = 'gap';

      return { num, status, captains: precinctCaptains };
    });
  }, [captains]);

  const gapPrecincts = useMemo(
    () => precinctCoverage.filter((p) => p.status === 'gap'),
    [precinctCoverage],
  );

  const unresponsiveCaptains = useMemo(
    () => captains.filter((c) => getCaptainStatus(c) === 'unresponsive'),
    [captains],
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 border-success/30 text-success';
      case 'partial': return 'bg-warning/20 border-warning/30 text-warning';
      case 'gap': return 'bg-danger/10 border-danger/20 text-danger';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          48th Ward Campaign Dashboard
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Precinct coverage, captain readiness, and turnout data for Leni Manaa-Hoppenworth
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          {
            label: 'Total Captains',
            value: stats.totalCaptains,
            sub: `${stats.activeCaptains} active · ${stats.needsFollowup} follow-up`,
            icon: Users,
          },
          {
            label: 'Precinct Coverage',
            value: `${stats.coveragePct}%`,
            sub: `${stats.coveredPrecincts}/${TOTAL_PRECINCTS} precincts`,
            icon: SquaresFour,
          },
          {
            label: 'Avg Turnout',
            value: `${stats.avgTurnout}%`,
            sub: `${turnout.length} precincts reporting`,
            icon: ChartBar,
          },
          {
            label: 'Businesses',
            value: stats.businessCount,
            sub: 'in ward directory',
            icon: Buildings,
          },
          {
            label: 'Priority Gaps',
            value: gapPrecincts.length,
            sub: 'precincts with no captain',
            icon: WarningCircle,
          },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-accent" weight="fill" />
              <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium">
                {stat.label}
              </span>
            </div>
            <div className="text-2xl font-semibold text-text-primary">{stat.value}</div>
            <div className="text-[11px] text-text-muted mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left: Precinct Coverage Grid */}
        <div className="stat-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Precinct Coverage</h2>
            <div className="flex items-center gap-3 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-success" /> Active</span>
              <span className="flex items-center gap-1"><WarningCircle className="h-3 w-3 text-warning" /> Partial</span>
              <span className="flex items-center gap-1"><WarningCircle className="h-3 w-3 text-danger" /> Gap</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {precinctCoverage.map((p) => (
              <Link
                key={p.num}
                to="/precincts"
                className={`px-2 py-2 rounded text-center text-xs font-medium border transition-colors ${statusColor(p.status)}`}
                title={`Precinct ${p.num}: ${p.captains.length} captain(s) — ${p.status}`}
              >
                {p.num}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Quick Actions + Alerts */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="stat-card space-y-3">
            <h2 className="text-sm font-semibold text-text-primary">Quick Actions</h2>
            <Link
              to="/captains"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-200/30 transition-colors"
            >
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> Captain Roster</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              to="/turnout"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-200/30 transition-colors"
            >
              <span className="flex items-center gap-2"><ChartBar className="h-4 w-4 text-accent" /> Turnout Report</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              to="/directory"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-200/30 transition-colors"
            >
              <span className="flex items-center gap-2"><Buildings className="h-4 w-4 text-accent" /> Ward Directory</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Priority Gaps */}
          {gapPrecincts.length > 0 && (
            <div className="stat-card space-y-3 border-danger/20">
              <h2 className="text-sm font-semibold text-danger flex items-center gap-2">
                <WarningCircle className="h-4 w-4" />
                Precincts Without Captains
              </h2>
              <div className="space-y-1">
                {gapPrecincts.map((p) => (
                  <div key={p.num} className="text-xs text-text-muted">
                    Precinct {p.num}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unresponsive Captains */}
          {unresponsiveCaptains.length > 0 && (
            <div className="stat-card space-y-3 border-warning/20">
              <h2 className="text-sm font-semibold text-warning flex items-center gap-2">
                <WarningCircle className="h-4 w-4" />
                Needs Follow-up ({unresponsiveCaptains.length})
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {unresponsiveCaptains.slice(0, 8).map((c, i) => (
                  <div key={i} className="text-xs">
                    <div className="font-medium text-text-secondary">{c.name.replace(/\?/g, '')}</div>
                    <div className="text-text-muted">P{c.precinct} · {c.polling_location}</div>
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="text-accent hover:underline flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
