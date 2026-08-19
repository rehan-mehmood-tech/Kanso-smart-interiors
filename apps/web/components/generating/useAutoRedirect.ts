"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAutoRedirect(destinationUrl: string, durationMs: number = 8000) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(percent);

      if (percent >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          router.push(destinationUrl);
        }, 500); // small delay after hitting 100%
      }
    }, 50); // High frequency updates for smooth progress bar and crossfade

    return () => clearInterval(interval);
  }, [destinationUrl, durationMs, router]);

  return progress;
}
