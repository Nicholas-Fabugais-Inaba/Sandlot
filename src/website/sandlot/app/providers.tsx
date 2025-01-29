// providers.tsx
"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from 'next-auth/react';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  session: any;  // Add session prop here
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

// providers.tsx
export function Providers({ children, themeProps, session }: ProvidersProps) {
  const router = useRouter();

  console.log("Session data:", session);  // Log the session here

  return (
    <SessionProvider session={session}>  {/* Pass the session prop here */}
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}
