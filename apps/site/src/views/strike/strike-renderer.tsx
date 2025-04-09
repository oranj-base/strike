'use client';

import React from 'react';
import { HttpAgent } from '@dfinity/agent';
import { Blink, useAction, useActionICPWalletAdapter } from '@oranjlabs/strike';

import { host } from '@/config';

export default function StrikeRenderer({ url }: { url: string }) {
  // TODO: update this
  const agent = new HttpAgent({ host });
  const { adapter } = useActionICPWalletAdapter({
    agent,
  });

  const { action } = useAction({ url, adapter });
  const { hostname } = new URL(action?.url || host);
  return (
    <>{action ? <Blink action={action} websiteText={hostname} /> : null}</>
  );
}
