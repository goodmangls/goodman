'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-11 min-w-11" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex min-h-11 min-w-12 items-center justify-center rounded-full transition-colors focus:outline-none"
      aria-label="Toggle theme"
    >
      <span className="relative flex h-6 w-12 items-center rounded-full bg-hairline p-1">
        <motion.span
          animate={{ x: isDark ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-full bg-ink"
        />
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
