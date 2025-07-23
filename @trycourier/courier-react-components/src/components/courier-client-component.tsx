import React, { useState, useEffect } from 'react';

interface CourierClientProps {
  children: React.ReactNode;
}

// This class prevents issues with server side rendering react components
// It will force the component to only render client side
// A future update could support server side rendering if there is enough demand
export const CourierClientComponent: React.FC<CourierClientProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR, render nothing or fallback
  if (typeof window === 'undefined') {
    return null;
  }

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};