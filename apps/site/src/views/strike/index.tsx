'use client';

import { useState } from 'react';
import { ICP_BLINK_PREFIX } from '@oranjlabs/strike';
import {
  ConnectButton,
  ConnectDialog,
} from '@oranjlabs/icp-wallet-adapter-react';
import '@oranjlabs/strike/index.css';
import '@oranjlabs/icp-wallet-adapter-react/index.css';

import StrikeRenderer from './strike-renderer';
import { StrikeLogo } from '@/assets';

export function StrikePage({ url: initialUrl }: { url: string }) {
  return (
    <div className="flex min-h-screen flex-col font-inter">
      <header className="flex items-center justify-between p-2 border border-b px-[20px]">
        <a className="flex flex-row gap-[4.36px] items-center" href="/">
          <StrikeLogo width={24} height={24} />
          <span className="font-bold font-syne text-[19.64px] leading-[19.64px]">
            STRIKE
          </span>
        </a>
        <ConnectButton
          style={{
            borderRadius: 12,
            padding: `8px 12px`,
            borderColor: '#2B5ACC',
            backgroundColor: '#3670FF',
            fontWeight: 600,
            fontSize: 14,
            borderWidth: 1,
            borderStyle: 'solid',
          }}
        />
      </header>
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
