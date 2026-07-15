import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { useState, useRef, useEffect, type ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative flex items-center">
        <MagnifyingGlass
          weight="regular"
          className={`absolute left-4 h-5 w-5 transition-colors duration-200 ${
            focused ? 'text-accent' : 'text-text-muted'
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/5 bg-surface-100/80 py-3 pl-12 pr-12 text-sm text-text-primary placeholder:text-text-muted backdrop-blur-sm outline-none transition-all duration-200"
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Clear search"
          >
            <X weight="bold" className="h-4 w-4" />
          </button>
        )}
      </div>
      {/* Animated underline */}
      <div
        className={`absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-300 ${
          focused ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`}
      />
      {/* Keyboard shortcut hint */}
      {!focused && !value && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 text-text-muted/60 text-xs">
          <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] font-mono bg-surface-200/50">
            &#8984;
          </kbd>
          <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] font-mono bg-surface-200/50">
            K
          </kbd>
        </div>
      )}
    </div>
  );
}
