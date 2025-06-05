import React, { useState, useEffect } from 'react';

interface CourierClientProps {
  children: React.ReactNode;
}

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