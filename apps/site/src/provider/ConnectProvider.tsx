'use client';

import { Connect2ICProvider } from '@oranjbase/icp-wallet-adapter-react';
import {
  createClient,
  InternetIdentity,
  Plug,
  Nfid,
  XverseConnector,
  UnisatConnector,
  OKXConnector,
  OrangeConnector,
} from '@oranjbase/icp-wallet-adapter';
import { useAction } from '@oranjbase/strike';
import '@oranjbase/strike/index.css';
import '@oranjbase/icp-wallet-adapter-react/index.css';
import { host, provider } from '../config';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const isServer = typeof window === 'undefined';

function createSiwbConnectors(config: any, siwbCanisterId: string) {
  return [
    new XverseConnector(config, { siwbCanisterId }),
    new UnisatConnector(config, { siwbCanisterId }),
    new OKXConnector(config, { siwbCanisterId }),
    new OrangeConnector(config, { siwbCanisterId }),
  ];
}

function createICPConnectors(config: any, canisterId?: string) {
  if (canisterId) {
    return [
      new InternetIdentity(config),
      new Plug(config, canisterId),
      new Nfid(config),
    ];
  } else {
    return [new InternetIdentity(config), new Nfid(config)];
  }
}

export default function ConnectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const actionUrl =
    searchParams?.get('url') ?? 'https://strike.oranj.co/actions.json';

  const { action } = useAction({ url: actionUrl, adapter: undefined });

  const siwbCanisterId = useMemo(() => action?.siwbCanisterId, [action]);

  const canisterId = useMemo(() => action?.canisterId, [action]);

  const config = {
    host,
    providerUrl: provider,
  };

  const providers = isServer
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

  return <Connect2ICProvider client={client}>{children}</Connect2ICProvider>;
}
