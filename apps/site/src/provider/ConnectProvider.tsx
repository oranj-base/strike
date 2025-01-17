'use client';

import { Connect2ICProvider } from '@oranjlabs/icp-wallet-adapter-react';
import {
  createClient,
  BTCWalletConnector,
  InternetIdentity,
} from '@oranjlabs/icp-wallet-adapter';
import '@oranjlabs/strike/index.css';
import '@oranjlabs/icp-wallet-adapter-react/index.css';
import {
  siwbMachine,
  createActor as createSIWBActor,
} from '@oranjbase/ic-siwb-js';
import { useMachine } from '@xstate/react';
import { host, provider, btcWallets } from '../config';

const isServer = typeof window === 'undefined';
const actor = createSIWBActor(
  process.env.NEXT_PUBLIC_CANISTER_ID_SIWB_PROVIDER,
  {
    agentOptions: { host },
  },
);

export default function ConnectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snapshot, send, actorRef] = useMachine(siwbMachine, {
    input: { anonymousActor: actor },
    inspect: (e) => console.debug(e),
  });

  const config = {
    host,
    providerUrl: provider,
    send,
    siwbActorRef: actorRef,
  };

  const providers = isServer
    ? []
    : [
        new InternetIdentity(config),
        new BTCWalletConnector({ ...config, btcWallet: btcWallets[0] }),
        new BTCWalletConnector({ ...config, btcWallet: btcWallets[1] }),
        new BTCWalletConnector({ ...config, btcWallet: btcWallets[2] }),
        new BTCWalletConnector({ ...config, btcWallet: btcWallets[3] }),
        new BTCWalletConnector({ ...config, btcWallet: btcWallets[4] }),
      ];

  const client = createClient({
    providers,
    globalProviderConfig: {
      host,
    },
  });

  return <Connect2ICProvider client={client}>{children}</Connect2ICProvider>;
}
