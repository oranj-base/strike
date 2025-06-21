'use client';

import React, { useContext, useEffect } from 'react';
import { HttpAgent } from '@dfinity/agent';
import { Blink, useAction, useActionICPWalletAdapter } from '@oranjbase/strike';
import { useClient } from '@oranjbase/icp-wallet-adapter-react';

import { host } from '@/config';

export default function StrikeRenderer({ url }: { url: string }) {
  // TODO: update this
  const agent = new HttpAgent({ host });
  const { adapter } = useActionICPWalletAdapter({
    agent,
  });

  const { setSiwbCanisterId, setCanisterId } = useClient();
  const { action } = useAction({ url, adapter });
  const { hostname } = new URL(action?.url || host);

  useEffect(() => {
    if (action?.siwbCanisterId) setSiwbCanisterId?.(action.siwbCanisterId);
    if (action?.canisterId) setCanisterId?.(action.canisterId);
  }, [action, setSiwbCanisterId]);
  return (
    <>{action ? <Blink action={action} websiteText={hostname} /> : null}</>
  );
}
