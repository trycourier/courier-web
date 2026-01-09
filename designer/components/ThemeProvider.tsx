'use client';

// ThemeProvider is a passthrough component.
// Theme handling is done by:
// 1. Inline script in layout.tsx (prevents flash on initial load)
// 2. useEffect in page.tsx (handles runtime theme changes)
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

