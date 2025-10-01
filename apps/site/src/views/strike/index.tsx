'use client';
import { ConnectDialog } from '@oranjbase/icp-wallet-adapter-react';
import '@oranjbase/strike/index.css';
import '@oranjbase/icp-wallet-adapter-react/index.css';

import StrikeRenderer from './strike-renderer';

export function StrikePage({ url: initialUrl }: { url: string }) {
  return (
    <div className="flex min-h-screen flex-col font-inter">
      <main className="flex flex-1 flex-col items-center justify-center px-2 py-4 md:px-8">
        <section className="flex w-full flex-1 flex-col items-center justify-center gap-6">
          <div className="w-full max-w-md">
            {initialUrl && <StrikeRenderer url={initialUrl} />}
          </div>
          <ConnectDialog />
        </section>
      </main>
      <footer></footer>
    </div>
  );
}
