import { useRef, useEffect, useState } from 'react';

interface FilterBarProps {
  categories: string[];
  active: string | null;
  onChange: (category: string | null) => void;
  label?: string;
}

export default function FilterBar({
  categories,
  active,
  onChange,
  label = 'Filter by category',
}: FilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  return (
    <div className="relative w-full">
      {/* Fade edges */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface-50 to-transparent z-10 pointer-events-none" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-surface-50 z-10 pointer-events-none" />
      )}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      >
        <button
          onClick={() => onChange(null)}
          className={`pill transition-all duration-200 whitespace-nowrap ${
            active === null
              ? 'bg-accent text-surface-50'
              : 'bg-surface-200/60 text-text-secondary hover:text-text-primary hover:bg-surface-200'
          }`}
        >
          {label}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(active === cat ? null : cat)}
            className={`pill transition-all duration-200 whitespace-nowrap ${
              active === cat
                ? 'bg-accent text-surface-50'
                : 'bg-surface-200/60 text-text-secondary hover:text-text-primary hover:bg-surface-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
