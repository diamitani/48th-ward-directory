import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Globe, Envelope, MapPin, Clock, Storefront } from '@phosphor-icons/react';
import type { Business } from '../types';

interface DetailModalProps {
  business: Business | null;
  onClose: () => void;
}

export default function DetailModal({ business, onClose }: DetailModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (business) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [business, handleKeyDown]);

  return (
    <AnimatePresence>
      {business && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-surface-50/80 backdrop-blur-md"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              mass: 0.8,
            }}
            className="relative w-full max-w-lg max-h-[85dvh] overflow-y-auto glass-card p-6 z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close"
            >
              <X weight="bold" className="h-5 w-5" />
            </button>

            <div className="space-y-5">
              {/* Header */}
              <div className="pr-8">
                <span className="pill bg-accent/10 text-accent border border-accent/20 mb-3 inline-block">
                  {business.category}
                </span>
                <h2 className="text-xl font-semibold text-text-primary">
                  {business.name}
                </h2>
              </div>

              {/* Address & Location */}
              <div className="space-y-2">
                {business.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin weight="regular" className="h-5 w-5 flex-shrink-0 text-text-muted mt-0.5" />
                    <div>
                      <p className="text-text-primary">{business.address}</p>
                      {business.neighborhood && (
                        <p className="text-text-muted text-xs mt-0.5">
                          {business.neighborhood} &middot; {business.precinct}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                {business.phone && (
                  <a
                    href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}
                    className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <Phone weight="regular" className="h-5 w-5 text-text-muted" />
                    {business.phone}
                  </a>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <Globe weight="regular" className="h-5 w-5 text-text-muted" />
                    {business.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <Envelope weight="regular" className="h-5 w-5 text-text-muted" />
                    {business.email}
                  </a>
                )}
              </div>

              {/* Hours */}
              {business.hours && (
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-start gap-3 text-sm">
                    <Clock weight="regular" className="h-5 w-5 text-text-muted mt-0.5" />
                    <div className="text-text-secondary whitespace-pre-line">
                      {business.hours}
                    </div>
                  </div>
                </div>
              )}

              {/* Owner */}
              {(business.owner || business.owner_phone) && (
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-start gap-3 text-sm">
                    <Storefront weight="regular" className="h-5 w-5 text-text-muted mt-0.5" />
                    <div>
                      {business.owner && (
                        <p className="text-text-primary">{business.owner}</p>
                      )}
                      {business.owner_phone && (
                        <a
                          href={`tel:${business.owner_phone.replace(/[^\d+]/g, '')}`}
                          className="text-text-muted text-xs hover:text-accent transition-colors"
                        >
                          {business.owner_phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {business.notes && (
                <div className="pt-2 border-t border-white/5">
                  <p className="text-sm text-text-muted italic">
                    {business.notes}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
