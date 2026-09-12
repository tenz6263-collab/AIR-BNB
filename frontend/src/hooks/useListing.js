import { useEffect, useState } from 'react';
import { api } from '../api/client';

export function useListing(slug) {
  const [state, setState] = useState({ listing: null, error: null, loading: true });

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
  }, [slug]);

  return state;
}
