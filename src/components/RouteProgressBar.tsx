import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * RouteProgressBar displays an ultra-fast, snappy glowing emerald progress bar
 * at the very top of the screen during route transitions.
 */
export default function RouteProgressBar() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        setVisible(true);
        setProgress(25);
        timer1 = setTimeout(() => {
          setProgress(85);
        }, 50);
      }
    };

    const handleComplete = () => {
      clearTimeout(timer1);
      setProgress(100);
      timer2 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 180);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[2px] overflow-hidden bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.9)]"
        style={{
          width: `${progress}%`,
          transition:
            progress === 100
              ? 'width 100ms ease-out, opacity 140ms ease-out 60ms'
              : 'width 120ms cubic-bezier(0.1, 0.9, 0.2, 1)',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
