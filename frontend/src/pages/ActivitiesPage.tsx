import { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar, Users, ChartBar, MapPin } from '@phosphor-icons/react';
import { getCaptains } from '../lib/data';
import { ACTIVITY_LABELS, ZONES, type ActivityType, type Captain, type ZoneId } from '../types';

const ACTIVITY_TYPES = Object.entries(ACTIVITY_LABELS) as [ActivityType, { label: string; icon: string; goal: 1 | 2 | 3 }][];

export default function ActivitiesPage() {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<ZoneId | 'all'>('all');
  const [selectedGoal, setSelectedGoal] = useState<1 | 2 | 3 | 'all'>('all');

  useEffect(() => {
    getCaptains()
      .then((c) => {
        const enriched = c.map((cap) => ({
          ...cap,
          zone: (cap as any).zone || null,
          activities: (cap as any).activities || [],
        }));
        setCaptains(enriched);
      })
      .finally(() => setLoading(false));
  }, []);

  const zoneCaptains = useMemo(() => {
    if (selectedZone === 'all') return captains;
    return captains.filter((c) => c.zone === selectedZone);
  }, [captains, selectedZone]);

  const allActivities = useMemo(() => {
    const acts: { captain: Captain; activity: Captain['activities'][0] }[] = [];
    for (const c of zoneCaptains) {
      for (const a of c.activities || []) {
        if (selectedGoal !== 'all' && ACTIVITY_LABELS[a.type]?.goal !== selectedGoal) continue;
        acts.push({ captain: c, activity: a });
      }
    }
    return acts.sort((a, b) => new Date(b.activity.date).getTime() - new Date(a.activity.date).getTime());
  }, [zoneCaptains, selectedGoal]);

  const stats = useMemo(() => {
    let totalReach = 0;
    let totalVolunteers = 0;
    for (const c of captains) {
      for (const a of c.activities || []) {
        totalReach += a.reach || 0;
        totalVolunteers += a.volunteers || 0;
      }
    }
    return { totalReach, totalVolunteers, totalActivities: allActivities.length };
  }, [captains, allActivities]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const { activity } of allActivities) {
      counts[activity.type] = (counts[activity.type] || 0) + 1;
    }
    return counts;
  }, [allActivities]);

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
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">Activity Tracker</h1>
        <p className="text-sm text-text-muted mt-1">
          Log and track precinct captain activities across the 48th Ward
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Activities Logged', value: stats.totalActivities, icon: ChartBar },
          { label: 'Total Reach', value: stats.totalReach.toLocaleString(), icon: Users },
          { label: 'Volunteers Mobilized', value: stats.totalVolunteers, icon: Plus },
          { label: 'Active Captains', value: captains.filter(c => (c.activities || []).length > 0).length, icon: MapPin },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <s.icon className="h-5 w-5 mx-auto mb-1 text-accent" weight="fill" />
            <div className="text-2xl font-semibold text-text-primary">{s.value}</div>
            <div className="text-[11px] text-text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">Zone:</span>
          <div className="flex gap-1">
            {[{ id: 'all' as const, label: 'All' }, ...ZONES].map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  selectedZone === z.id
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'text-text-muted hover:text-text-secondary border border-transparent'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">Goal:</span>
          <div className="flex gap-1">
            {[
              { id: 'all' as const, label: 'All' },
              { id: 1 as const, label: 'GOTV' },
              { id: 2 as const, label: 'Turnout' },
              { id: 3 as const, label: 'Community' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGoal(g.id)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  selectedGoal === g.id
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'text-text-muted hover:text-text-secondary border border-transparent'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
        {allActivities.length > 0 && (
          <span className="text-xs text-text-muted ml-auto">
            {allActivities.length} activities
          </span>
        )}
      </div>

      {/* Activity type breakdown */}
      {Object.keys(typeCounts).length > 0 && (
        <div className="stat-card">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Activity Breakdown</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2">
            {ACTIVITY_TYPES.map(([type, meta]) => {
              const count = typeCounts[type] || 0;
              if (selectedGoal !== 'all' && meta.goal !== selectedGoal) return null;
              return (
                <div key={type} className={`text-center p-3 rounded-lg ${count > 0 ? 'bg-surface-200/50' : 'opacity-30'}`}>
                  <div className="text-lg">{meta.icon}</div>
                  <div className={`text-sm font-semibold ${count > 0 ? 'text-text-primary' : 'text-text-muted'}`}>
                    {count}
                  </div>
                  <div className="text-[9px] text-text-muted leading-tight">{meta.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div className="stat-card space-y-2">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Recent Activity Feed</h2>
        {allActivities.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="h-10 w-10 mx-auto text-text-muted/30 mb-3" />
            <p className="text-sm text-text-muted">No activities logged yet.</p>
            <p className="text-xs text-text-muted mt-1">
              Activities will appear here as captains log their work.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {allActivities.slice(0, 50).map(({ captain, activity }, i) => {
              const meta = ACTIVITY_LABELS[activity.type];
              const goalColors = [
                '',
                'border-l-accent',
                'border-l-success',
                'border-l-[#7C3AED]',
              ];
              return (
                <div
                  key={i}
                  className={`flex items-start gap-4 p-3 rounded-lg bg-surface-100/50 border-l-2 ${goalColors[meta.goal] || 'border-l-surface-border'}`}
                >
                  <span className="text-lg mt-0.5">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{meta.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-text-muted">
                        Goal {meta.goal}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{activity.notes}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Users className="h-3 w-3" /> {activity.volunteers || 0} volunteers
                      </span>
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <ChartBar className="h-3 w-3" /> Reach: {activity.reach || 0}
                      </span>
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {activity.date}
                      </span>
                      <span className="text-[10px] text-text-muted ml-auto">
                        {captain.name.replace(/\?/g, '')} · P{captain.precinct}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
