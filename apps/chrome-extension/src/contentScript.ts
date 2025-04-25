import '@oranjlabs/strike/index.css';
import { ActionConfig, setupTwitterObserver } from '@oranjlabs/strike';
import { createClient, defaultProviders } from '@oranjlabs/icp-wallet-adapter';
import type { IDL } from '@dfinity/candid';

export const host =
  import.meta.env.VITE_DFX_NETWORK === 'ic'
    ? 'https://icp0.io'
    : 'http://127.0.0.1:4943';

export const provider =
  import.meta.env.VITE_DFX_NETWORK === 'ic'
    ? 'https://identity.ic0.app'
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943';

const adapter = (wallet: string) => {
  const client = createClient({
    providers: defaultProviders({
      host,
      providerUrl: provider,
      whitelist: [],
      autoConnect: true,
    }),
    globalProviderConfig: {
      host,
    },
  });

  return new ActionConfig(host, {
    createActor: async (
      canisterId: string,
      idlFactory: IDL.InterfaceFactory,
    ) => {
      const actorResult = await client.activeProvider?.createActor(
        canisterId,
        idlFactory,
      );

      if (!actorResult || actorResult.isErr()) {
        return { error: 'Unable to create actor' };
      }
      const actor = actorResult.value;
      return { actor };
    },
    connect: async () => {
      if (
        client.activeProvider &&
        client.status === 'connected' &&
        client.activeProvider.meta.id === wallet
      ) {
        return client.activeProvider.identity;
      }
      const { activeProvider } = await client.connectAsync({
        provider: wallet,
      });
      return activeProvider.identity;
    },
  });
};

function initTwitterObserver() {
  // chrome.runtime.sendMessage(
  //   { type: 'connect', wallet: 'XverseProviders.BitcoinProvider' },
  //   (response) => {
  //     if (chrome.runtime.lastError) {
  //       console.error('Error getting Xverse wallet:', chrome.runtime.lastError);
  //       return;
  //     }
  //     if (response) {
  //       console.log('Xverse wallet:', response);
  //       // @ts-ignore
  //       window.XverseProviders.BitcoinProvider = response;
  //       // You can use the response here
  //     } else {
  //       console.log('No response from Xverse wallet');
  //     }
  //   },
  // );
  chrome.storage.local.get('strikeProvider', async (result) => {
    const storedWallet: string = result?.strikeProvider ?? 'ii';
    console.debug(`Initializing twitter observer with wallet: ${storedWallet}`);
    setupTwitterObserver(adapter(storedWallet));
  });
}

initTwitterObserver();
