import { NavLink, Outlet } from 'react-router-dom';
import {
  House,
  Users,
  SquaresFour,
  ChartBar,
  Buildings,
  Target,
  List,
} from '@phosphor-icons/react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: House },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/captains', label: 'Captains', icon: Users },
  { to: '/activities', label: 'Activities', icon: List },
  { to: '/precincts', label: 'Precincts', icon: SquaresFour },
  { to: '/turnout', label: 'Turnout', icon: ChartBar },
  { to: '/directory', label: 'Directory', icon: Buildings },
] as const;

export default function DashboardLayout() {
  return (
    <div className="min-h-[100dvh] flex bg-surface-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-56 border-r border-surface-border bg-surface-50 flex flex-col z-40">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-surface-border">
          <h1 className="text-sm font-semibold tracking-tight text-text-primary">
            Leni <span className="text-accent">48</span>
          </h1>
          <p className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wider">
            Campaign Dashboard
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon weight={item.to === '/' ? 'fill' : 'regular'} className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-surface-border">
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            48th Ward · Chicago
          </p>
          <p className="text-[10px] text-text-muted mt-0.5">
            Internal — Not for public distribution
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-56">
        <Outlet />
      </div>
    </div>
  );
}
