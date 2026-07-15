import { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  House,
  Users,
  SquaresFour,
  ChartBar,
  Buildings,
  Target,
  List,
  X,
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

function SidebarContent({ onClick }: { onClick?: () => void }) {
  return (
    <>
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
            onClick={onClick}
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
    </>
  );
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-[100dvh] flex bg-surface-50">
      {/* Desktop Sidebar — hidden below lg */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 border-r border-surface-border bg-surface-50 flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 border-r border-surface-border bg-surface-50 flex flex-col z-50 shadow-2xl animate-[slideIn_0.2s_ease-out]">
            <div className="flex items-center justify-between px-5 py-5 border-b border-surface-border">
              <h1 className="text-sm font-semibold tracking-tight text-text-primary">
                Leni <span className="text-accent">48</span>
              </h1>
              <button
                onClick={closeMobile}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-200 transition-colors"
                aria-label="Close menu"
              >
                <X weight="bold" className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onClick={closeMobile} />
          </aside>
        </div>
      )}

      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 border-b border-surface-border bg-surface-50/95 backdrop-blur-md flex items-center justify-between px-4 z-30">
        <h1 className="text-sm font-semibold tracking-tight text-text-primary">
          Leni <span className="text-accent">48</span>
        </h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-200 transition-colors"
          aria-label="Open menu"
        >
          <List weight="bold" className="h-5 w-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-56 pt-14 lg:pt-0">
        <Outlet />
      </div>
    </div>
  );
}
