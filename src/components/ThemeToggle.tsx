import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { HiMoon, HiSun } from 'react-icons/hi';

/**
 * ThemeToggle – animates between sun (light) and moon (dark) icons.
 * Renders an empty placeholder until mounted to avoid hydration mismatch.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after hydration to prevent server/client mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Reserve space so layout doesn't shift
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300
        border-zinc-200 bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900
        dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'sun' : 'moon'}
          initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex items-center justify-center"
        >
          {/* In dark mode show sun (switch to light); in light mode show moon */}
          {isDark ? <HiSun className="h-4 w-4" /> : <HiMoon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
