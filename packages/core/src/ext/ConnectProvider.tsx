'use client';

import {
  createClient,
  InternetIdentity,
  Nfid,
  OKXConnector,
  OrangeConnector,
  PlugForExtension,
  UnisatConnector,
  XverseConnector,
} from '@oranjbase/icp-wallet-adapter';
import { Connect2ICProvider } from '@oranjbase/icp-wallet-adapter-react';
import '@oranjbase/icp-wallet-adapter-react/index.css';
import '@oranjbase/strike/index.css';

const isServer = typeof window === 'undefined';

export const host = 'https://icp0.io';

export const provider = 'https://identity.ic0.app';

function createSiwbConnectors(config: any, siwbCanisterId: string) {
  return [
    new XverseConnector(config, { siwbCanisterId }),
    new UnisatConnector(config, { siwbCanisterId }),
    new OKXConnector(config, { siwbCanisterId }),
    new OrangeConnector(config, { siwbCanisterId }),
  ];
}

function createICPConnectors(config: any, canisterId: string) {
  return [
    new InternetIdentity(config),
    new PlugForExtension(config, { canisterId }),
    new Nfid(config),
  ];
}

export default function ConnectProvider({
  children,
  siwbCanisterId,
  canisterId,
}: {
  children: React.ReactNode;
  siwbCanisterId?: string;
  canisterId?: string;
}) {
  const config = {
    host,
    providerUrl: provider,
    isExtension: true,
  };

  const providers =
    isServer || !canisterId
      ? []
      : !siwbCanisterId
        ? [...createICPConnectors(config, canisterId)]
        : [
            ...createICPConnectors(config, canisterId),
            ...createSiwbConnectors(config, siwbCanisterId),
          ];

  const client = createClient({
    providers,
    globalProviderConfig: {
      host,
    },
  });

  return (
    <Connect2ICProvider
      client={client}
      setSiwbCanisterId={() => {}}
      setCanisterId={() => {}}
    >
      {children}
    </Connect2ICProvider>
  );
}
