import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Buildings, Storefront, Funnel } from '@phosphor-icons/react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import BusinessCard from '../components/BusinessCard';
import DetailModal from '../components/DetailModal';
import Pagination from '../components/Pagination';
import {
  getBusinesses,
  extractCategories,
  searchBusinesses,
  sortBusinesses,
} from '../lib/data';
import type { Business } from '../types';

const ITEMS_PER_PAGE = 20;

export default function DirectoryPage() {
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    getBusinesses()
      .then(setAllBusinesses)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => extractCategories(allBusinesses), [allBusinesses]);

  const filtered = useMemo(() => {
    const searched = searchBusinesses(allBusinesses, query, activeCategory);
    return sortBusinesses(searched, sortBy);
  }, [allBusinesses, query, activeCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeCategory, sortBy]);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const stats = useMemo(() => {
    const precincts = new Set(allBusinesses.map((b) => b.precinct));
    const cats = new Set(allBusinesses.map((b) => b.category));
    return {
      total: allBusinesses.length,
      precincts: precincts.size,
      categories: cats.size,
    };
  }, [allBusinesses]);

  const handleCategoryChange = useCallback((cat: string | null) => {
    setActiveCategory(cat);
  }, []);

  return (
    <div className="min-h-[100dvh]">
      {/* Hero — asymmetric: left text, right stats */}
      <section className="relative grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-16 pt-24 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 pill bg-chicago-red/10 text-chicago-red border border-chicago-red/20">
            <Buildings weight="fill" className="h-3 w-3" />
            <span>48th Ward</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-text-primary">
            Local
            <br />
            <span className="font-semibold text-accent">Businesses</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-lg leading-relaxed">
            Explore {stats.total} businesses across {stats.precincts} precincts in
            Edgewater, Andersonville, and Uptown.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-4">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider">
              <Storefront weight="regular" className="h-3.5 w-3.5" />
              Ward at a glance
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-semibold text-accent">
                  {stats.total}
                </div>
                <div className="text-xs text-text-muted mt-1">Businesses</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-text-primary">
                  {stats.precincts}
                </div>
                <div className="text-xs text-text-muted mt-1">Precincts</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-text-primary">
                  {stats.categories}
                </div>
                <div className="text-xs text-text-muted mt-1">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="sticky top-[72px] z-30 bg-surface-50/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search businesses by name, address, or neighborhood..."
            />
            <div className="flex items-center gap-3 flex-shrink-0">
              <Funnel weight="regular" className="h-4 w-4 text-text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-100/80 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-secondary outline-none focus:border-accent/30 transition-colors"
              >
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="precinct">Precinct</option>
              </select>
            </div>
          </div>
          <FilterBar
            categories={categories}
            active={activeCategory}
            onChange={handleCategoryChange}
          />
          <div className="flex items-center justify-between text-sm text-text-muted">
            <span>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {activeCategory && (
                <span>
                  {' '}
                  in{' '}
                  <span className="text-accent font-medium">
                    {activeCategory}
                  </span>
                </span>
              )}
              {query && (
                <span>
                  {' '}
                  for "<span className="text-text-secondary">{query}</span>"
                </span>
              )}
            </span>
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="text-accent hover:text-accent-dim transition-colors text-xs"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {loading ? (
          /* Skeleton shimmer */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="glass-card p-6 animate-pulse space-y-3"
              >
                <div className="h-5 bg-surface-200/60 rounded w-3/4" />
                <div className="h-3 bg-surface-200/40 rounded w-1/2" />
                <div className="h-3 bg-surface-200/40 rounded w-2/3" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 bg-surface-200/40 rounded-full" />
                  <div className="h-6 w-20 bg-surface-200/40 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Storefront
              weight="thin"
              className="h-16 w-16 text-text-muted/30 mb-6"
            />
            <h3 className="text-xl font-medium text-text-primary mb-2">
              No businesses match your filters
            </h3>
            <p className="text-text-muted max-w-md">
              Try adjusting your search or clearing the category filter to see
              more results.
            </p>
            {(query || activeCategory) && (
              <button
                onClick={() => {
                  setQuery('');
                  setActiveCategory(null);
                }}
                className="mt-4 btn-primary text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 2-column grid (NOT 3-column!) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paged.map((business, idx) => (
                <motion.div
                  key={business.name + business.address}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: idx * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <BusinessCard
                    business={business}
                    index={idx}
                    onClick={() => setSelectedBusiness(business)}
                  />
                </motion.div>
              ))}
            </div>
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </section>

      {/* Detail Modal */}
      <DetailModal
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
      />
    </div>
  );
}
