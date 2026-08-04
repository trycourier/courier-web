'use client';

import { useEffect, useState } from 'react';
import { areInternalEnvironmentsLoaded, loadInternalEnvironments } from './api-urls';

/**
 * Loads the internal API environments from the config endpoint once, and
 * triggers a re-render when they arrive. Returns whether the load has completed
 * (public environments are always available regardless).
 */
export function useApiEnvironments(): boolean {
  const [loaded, setLoaded] = useState<boolean>(areInternalEnvironmentsLoaded());

  useEffect(() => {
    if (loaded) return;
    let active = true;
    loadInternalEnvironments().then(() => {
      if (active) setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [loaded]);

  return loaded;
}
