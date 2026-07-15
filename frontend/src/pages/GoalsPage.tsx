import { useState, useEffect, useMemo } from 'react';
import { Target, Users, ChartLine } from '@phosphor-icons/react';
import { getCaptains } from '../lib/data';
import {
  CAMPAIGN_GOALS,
  ACTIVITY_LABELS,
  type ActivityType,
  type Captain,
} from '../types';

function goalColor(id: number) {
  switch (id) {
    case 1: return { bg: 'bg-accent/10', border: 'border-accent/30', bar: 'bg-accent', text: 'text-accent' };
    case 2: return { bg: 'bg-success/10', border: 'border-success/30', bar: 'bg-success', text: 'text-success' };
    case 3: return { bg: 'bg-[#7C3AED]/10', border: 'border-[#7C3AED]/30', bar: 'bg-[#7C3AED]', text: 'text-[#7C3AED]' };
    default: return { bg: 'bg-accent/10', border: 'border-accent/30', bar: 'bg-accent', text: 'text-accent' };
  }
}

export default function GoalsPage() {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCaptains()
      .then((c) => {
        // Enrich with default PAL fields since existing data predates this build
        const enriched = c.map((cap) => ({
          ...cap,
          zone: (cap as any).zone || null,
          member_48_dems: (cap as any).member_48_dems ?? !!cap.google_group,
          election_year_role: (cap as any).election_year_role || (cap.google_group ? 'captain' : 'volunteer'),
          activities: (cap as any).activities || [],
        }));
        setCaptains(enriched);
      })
      .finally(() => setLoading(false));
  }, []);

  const goals = useMemo(() => {
    // Compute actual progress from captain activities
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    for (const c of captains) {
      for (const a of c.activities || []) {
        const goal = ACTIVITY_LABELS[a.type]?.goal;
        if (goal) counts[goal]++;
      }
    }

    // Also count captains with any activity per goal area
    const captainsByGoal: Record<number, Set<string>> = { 1: new Set(), 2: new Set(), 3: new Set() };
    for (const c of captains) {
      for (const a of c.activities || []) {
        const goal = ACTIVITY_LABELS[a.type]?.goal;
        if (goal) captainsByGoal[goal].add(c.name);
      }
    }

    return CAMPAIGN_GOALS.map((g) => ({
      ...g,
      current: counts[g.id] || 0,
      captainsEngaged: captainsByGoal[g.id]?.size || 0,
      percent: Math.min(100, Math.round(((counts[g.id] || 0) / g.target) * 100)),
    }));
  }, [captains]);

  const totalActivities = useMemo(
    () => captains.reduce((sum, c) => sum + (c.activities || []).length, 0),
    [captains],
  );
  const activeCaptains = useMemo(
    () => captains.filter((c) => (c.activities || []).length > 0).length,
    [captains],
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">Campaign Goals</h1>
        <p className="text-sm text-text-muted mt-1">
          Three primary goals from the Precinct Captain Overview &amp; Responsibilities
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Activities', value: totalActivities, icon: ChartLine },
          { label: 'Active Captains', value: activeCaptains, icon: Users },
          { label: 'Total Captains', value: captains.length, icon: Target },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <s.icon className="h-5 w-5 mx-auto mb-1 text-accent" weight="fill" />
            <div className="text-2xl font-semibold text-text-primary">{s.value}</div>
            <div className="text-[11px] text-text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const colors = goalColor(goal.id);
          return (
            <div key={goal.id} className={`stat-card space-y-4 ${colors.border} border`}>
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                  <span className="text-lg">{goal.id === 1 ? '🗳️' : goal.id === 2 ? '📊' : '🤝'}</span>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">{goal.title}</h2>
                  <p className="text-[11px] text-text-muted">{goal.id === 1 ? 'Progressive Democrats' : goal.id === 2 ? 'Ballots Cast' : 'Civic Engagement'}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-text-secondary leading-relaxed">{goal.description}</p>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-text-muted">Progress</span>
                  <span className={`font-semibold ${colors.text}`}>{goal.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-300 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${colors.bar}`}
                    style={{ width: `${goal.percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted mt-1">
                  <span>{goal.current} activities logged</span>
                  <span>Target: {goal.target}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-border">
                <div>
                  <div className={`text-lg font-semibold ${colors.text}`}>{goal.captainsEngaged}</div>
                  <div className="text-[10px] text-text-muted">Captains Engaged</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-text-primary">{goal.activities.length}</div>
                  <div className="text-[10px] text-text-muted">Activity Types</div>
                </div>
              </div>

              {/* Activity types */}
              <div className="flex flex-wrap gap-1">
                {goal.activities.map((a: ActivityType) => (
                  <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-200 text-text-muted">
                    {ACTIVITY_LABELS[a].icon} {ACTIVITY_LABELS[a].label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Captain Engagement Table */}
      <div className="stat-card space-y-3">
        <h2 className="text-sm font-semibold text-text-primary">Captain Goal Engagement</h2>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Captain</th>
                <th>Precinct</th>
                <th>Activities</th>
                <th>Goal 1</th>
                <th>Goal 2</th>
                <th>Goal 3</th>
              </tr>
            </thead>
            <tbody>
              {captains
                .filter((c) => (c.activities || []).length > 0)
                .sort((a, b) => (b.activities || []).length - (a.activities || []).length)
                .slice(0, 20)
                .map((c, i) => {
                  const acts = c.activities || [];
                  const g1 = acts.filter((a) => ACTIVITY_LABELS[a.type]?.goal === 1).length;
                  const g2 = acts.filter((a) => ACTIVITY_LABELS[a.type]?.goal === 2).length;
                  const g3 = acts.filter((a) => ACTIVITY_LABELS[a.type]?.goal === 3).length;
                  return (
                    <tr key={i}>
                      <td className="font-medium text-text-primary">{c.name.replace(/\?/g, '')}</td>
                      <td><span className="text-accent font-mono">P{c.precinct}</span></td>
                      <td className="font-semibold">{acts.length}</td>
                      <td>{g1 > 0 ? <span className="badge badge-success">{g1}</span> : <span className="text-text-muted">—</span>}</td>
                      <td>{g2 > 0 ? <span className="badge badge-warning">{g2}</span> : <span className="text-text-muted">—</span>}</td>
                      <td>{g3 > 0 ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED]">{g3}</span> : <span className="text-text-muted">—</span>}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
