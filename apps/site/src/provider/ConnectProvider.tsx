'use client';

import { Connect2ICProvider } from '@oranjlabs/icp-wallet-adapter-react';
import {
  createClient,
  XverseConnector,
  InternetIdentity,
  UnisatConnector,
  OKXConnector,
  OrangeConnector,
} from '@oranjlabs/icp-wallet-adapter';
import { useAction } from '@oranjlabs/strike';
import '@oranjlabs/strike/index.css';
import '@oranjlabs/icp-wallet-adapter-react/index.css';
import { host, provider } from '../config';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const isServer = typeof window === 'undefined';

function createProviders(config: any, siwbCanisterId: string) {
  return [
    new XverseConnector(config, { siwbCanisterId }),
    new UnisatConnector(config, { siwbCanisterId }),
    new OKXConnector(config, { siwbCanisterId }),
    new OrangeConnector(config, { siwbCanisterId }),
  ];
}

export default function ConnectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const actionUrl = searchParams.get('url');

  const { action } = useAction({ url: actionUrl, adapter: undefined });

  const siwbCanisterId = useMemo(() => action?.siwbCanisterId, [action]);

  const config = {
    host,
    providerUrl: provider,
  };

  const providers = isServer
    ? []
    : !siwbCanisterId
      ? [new InternetIdentity(config)]
      : [
          new InternetIdentity(config),
          ...createProviders(config, siwbCanisterId),
        ];

  const client = createClient({
    providers,
    globalProviderConfig: {
      host,
    },
  });

  return <Connect2ICProvider client={client}>{children}</Connect2ICProvider>;
}
