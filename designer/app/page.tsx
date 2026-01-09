'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * This is the root page for the application.
 * It redirects to the inbox-demo page with the same query parameters.
 */
export default function RootPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryString = searchParams.toString();
    const redirectUrl = queryString ? `/inbox-demo?${queryString}` : '/inbox-demo';
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return null;
}
