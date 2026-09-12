import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

/** Loads the listing; `retry()` re-runs the request after a failure. */
export function useListing(slug) {
  const [state, setState] = useState({ listing: null, error: null, loading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ listing: null, error: null, loading: true });
    api
      .getListing(slug)
      .then((listing) => {
        if (!cancelled) setState({ listing, error: null, loading: false });
      })
      .catch((error) => {
        if (!cancelled) setState({ listing: null, error, loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [slug, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
