'use client';

import * as React from 'react';
import { RainbowKitProvider, darkTheme, lightTheme, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { polygon, localhost } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from 'next-themes';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'NexusAgent Defense',
  projectId: 'nexus-agent-demo-1234',
  chains: [polygon, localhost],
  ssr: true,
  transports: {
    [polygon.id]: http(),
    [localhost.id]: http(),
  },
});

const queryClient = new QueryClient();

// Inner wrapper to access theme after ThemeProvider mounts
function RainbowKitWithTheme({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const rainbowTheme = mounted && resolvedTheme === 'light'
    ? lightTheme({
        accentColor: '#2563EB',
        accentColorForeground: 'white',
        borderRadius: 'large',
        fontStack: 'system',
      })
    : darkTheme({
        accentColor: '#3B82F6',
        accentColorForeground: 'white',
        borderRadius: 'medium',
        fontStack: 'system',
        overlayBlur: 'large',
      });

  return (
    <RainbowKitProvider theme={rainbowTheme} modalSize="compact" appInfo={{ appName: 'NexusAgent' }}>
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitWithTheme>
            {children}
          </RainbowKitWithTheme>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
