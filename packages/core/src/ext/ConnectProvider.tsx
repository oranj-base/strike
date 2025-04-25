'use client';

import {
  createClient,
  InternetIdentity,
  Nfid,
  OKXConnector,
  OrangeConnector,
  Plug,
  UnisatConnector,
  XverseConnector,
} from '@oranjlabs/icp-wallet-adapter';
import { Connect2ICProviderWithAction } from '@oranjlabs/icp-wallet-adapter-react';
import '@oranjlabs/icp-wallet-adapter-react/index.css';
import '@oranjlabs/strike/index.css';
import { useMemo } from 'react';

const isServer = typeof window === 'undefined';

export const host = 'https://icp0.io';

export const provider = 'https://identity.ic0.app';

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
  action,
}: {
  children: React.ReactNode;
  action: any;
}) {
  const siwbCanisterId = useMemo(() => action?.siwbCanisterId, [action]);
  const config = {
    host,
    providerUrl: provider,
    isExtension: true,
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

  return (
    <Connect2ICProviderWithAction client={client} action={action}>
      {children}
    </Connect2ICProviderWithAction>
  );
}
