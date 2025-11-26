import { ConvexProvider as BaseConvexProvider } from 'convex/react';
import { ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

const convexUrl = import.meta.env.VITE_CONVEX_URL || '';

if (!convexUrl) {
  console.warn(
    'VITE_CONVEX_URL environment variable is not set. Convex features will not work.',
  );
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexProvider({ children }: { children: ReactNode }) {
  return <BaseConvexProvider client={convex}>{children}</BaseConvexProvider>;
}
