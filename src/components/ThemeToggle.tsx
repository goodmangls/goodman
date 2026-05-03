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

  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-12 h-6 rounded-full bg-hairline p-1 flex items-center transition-colors focus:outline-none"
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-4 h-4 rounded-full bg-ink flex items-center justify-center overflow-hidden"
      >
        <div className="w-full h-full bg-ink" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
