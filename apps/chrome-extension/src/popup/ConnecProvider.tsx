'use client';

import { Connect2ICProvider } from '@oranjlabs/icp-wallet-adapter-react';
import {
  createClient,
  InternetIdentity,
  Plug,
  Nfid,
  XverseConnector,
  UnisatConnector,
  OKXConnector,
  OrangeConnector,
} from '@oranjlabs/icp-wallet-adapter';
import { useAction } from '@oranjlabs/strike';
import '@oranjlabs/strike/index.css';
import '@oranjlabs/icp-wallet-adapter-react/index.css';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const isServer = typeof window === 'undefined';
const host = 'https://icp0.io';
const provider = 'https://identity.ic0.app';

function createSiwbConnectors(config: any) {
  return [
    new XverseConnector(config),
    new UnisatConnector(config),
    new OKXConnector(config),
    new OrangeConnector(config),
  ];
}

function createICPConnectors(config: any) {
  return [new InternetIdentity(config), new Plug(config), new Nfid(config)];
}

export default function ConnectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const actionUrl = 'icp-action:https://strike.oranj.co/actions.json';

  const { action } = useAction({ url: actionUrl, adapter: undefined });

  const siwbCanisterId = useMemo(() => action?.siwbCanisterId, [action]);

  const config = {
    host,
    providerUrl: provider,
  };

  const providers = isServer
    ? []
    : !siwbCanisterId
      ? [...createICPConnectors(config)]
      : [...createICPConnectors(config), ...createSiwbConnectors(config)];

  const client = createClient({
    providers,
    globalProviderConfig: {
      host,
    },
  });

  return <Connect2ICProvider client={client}>{children}</Connect2ICProvider>;
}
