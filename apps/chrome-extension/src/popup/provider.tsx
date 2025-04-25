import { Suspense } from 'react';
import ConnectProvider from './ConnecProvider';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <ConnectProvider>{children}</ConnectProvider>
    </Suspense>
  );
}
