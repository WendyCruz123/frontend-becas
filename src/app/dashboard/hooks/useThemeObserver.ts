'use client';

import { useEffect, useState } from 'react';

export function useThemeObserver() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const update = () => {
      const t = document.documentElement.getAttribute('data-theme') as
        | 'light'
        | 'dark';
      if (t) setTheme(t);
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
