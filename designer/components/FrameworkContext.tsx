'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export type FrameworkType = 'react' | 'web-components';

interface FrameworkContextType {
  frameworkType: FrameworkType;
  setFrameworkType: (type: FrameworkType) => void;
}

const FrameworkContext = createContext<FrameworkContextType | undefined>(undefined);

const VALID_FRAMEWORKS: FrameworkType[] = ['react', 'web-components'];
const DEFAULT_FRAMEWORK: FrameworkType = 'react';

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize from URL or default
  const getInitialFramework = useCallback((): FrameworkType => {
    const param = searchParams.get('framework');
    if (param && VALID_FRAMEWORKS.includes(param as FrameworkType)) {
      return param as FrameworkType;
    }
    return DEFAULT_FRAMEWORK;
  }, [searchParams]);

  const [frameworkType, setFrameworkTypeState] = useState<FrameworkType>(getInitialFramework);

  // Update URL when framework changes
  const setFrameworkType = useCallback((type: FrameworkType) => {
    setFrameworkTypeState(type);
    
    const params = new URLSearchParams(searchParams.toString());
    if (type === DEFAULT_FRAMEWORK) {
      params.delete('framework');
    } else {
      params.set('framework', type);
    }
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  return (
    <FrameworkContext.Provider value={{ frameworkType, setFrameworkType }}>
      {children}
    </FrameworkContext.Provider>
  );
}

export function useFramework() {
  const context = useContext(FrameworkContext);
  if (context === undefined) {
    throw new Error('useFramework must be used within a FrameworkProvider');
  }
  return context;
}

