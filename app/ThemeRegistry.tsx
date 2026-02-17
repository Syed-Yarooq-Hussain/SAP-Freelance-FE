'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from '@/theme';
// import theme from './theme';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const theme = React.useMemo(() => getTheme("light"), []);

  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: 'mui', prepend: true });
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: string[] = [];

    cache.insert = (...args: any) => {
      const serialized = args[1];
      if (!cache.inserted[serialized.name]) {
        inserted.push(serialized.name);
      }
      return prevInsert(...(args as Parameters<typeof prevInsert>));
    };

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    let styles = '';
    names.forEach(name => {
      styles += cache.inserted[name];
    });

    return (
      <style
        data-emotion={`mui ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
        {children}
    </CacheProvider>
  );
}
