import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

/** Saved state for a listing, optimistic toggle backed by the API. */
export function useWishlist(slug, onChange) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .getWishlist(slug)
      .then((r) => setSaved(r.saved))
      .catch(() => {});
  }, [slug]);

  const toggle = useCallback(async () => {
    const next = !saved;
    setSaved(next);
    onChange?.(next);
    try {
      const r = await api.toggleWishlist(slug);
      setSaved(r.saved);
    } catch {
      setSaved(!next);
    }
  }, [saved, slug, onChange]);

  return { saved, toggle };
}
