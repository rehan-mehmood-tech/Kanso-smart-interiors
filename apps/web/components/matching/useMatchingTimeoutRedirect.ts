"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useMatchingTimeoutRedirect(destinationUrl: string, durationMs: number = 6000) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(destinationUrl);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [destinationUrl, durationMs, router]);
}
