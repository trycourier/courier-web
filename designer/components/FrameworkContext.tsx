'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type FrameworkType = 'react' | 'web-components';

interface FrameworkContextType {
  frameworkType: FrameworkType;
  setFrameworkType: (type: FrameworkType) => void;
}

const FrameworkContext = createContext<FrameworkContextType | undefined>(undefined);

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const [frameworkType, setFrameworkType] = useState<FrameworkType>('react');

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

