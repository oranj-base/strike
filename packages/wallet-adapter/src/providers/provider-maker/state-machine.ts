import type { ActorSubclass } from "@dfinity/agent";
import {
  type DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
} from "@dfinity/identity";
import { assign, emit, fromPromise, setup } from "xstate";
import type {
  SIWB_IDENTITY_SERVICE,
  SignMessageRawType,
} from "@oranjbase/ic-siwb-js";
import { createDelegationChain } from "@oranjbase/ic-siwb-js";

import {
  callGetDelegation,
  callLogin,
  callPrepareLogin,
} from "@oranjbase/ic-siwb-js";
import {
  AddressType,
  type BitcoinProviderMaker,
  getAddressType,
  getRegisterExtension,
  type IWalletProvider,
  type NetworkItem,
  type SupportedProvider,
  type WalletProviderKey,
} from "./wallet";
import { SiwbStorage } from "@oranjbase/ic-siwb-js";

export type State =
  | "initializing"
  | "connecting"
  | "disconnected"
  | "connected"
  | "preparing"
  | "signing"
  | "authenticating"
  | "authenticated"
  | "idle";

export type Context = {
  providerKey?: WalletProviderKey;
  address?: string;
  publicKey?: string;
  connected: boolean;
  provider?: IWalletProvider | BitcoinProviderMaker;
  network?: NetworkItem;
  anonymousActor?: ActorSubclass<SIWB_IDENTITY_SERVICE>;
  identity?: DelegationIdentity;
  delegationChain?: DelegationChain;
  siwbMessage?: string;
  signMessageType?: SignMessageRawType;
  signature?: string;
};

export type ConnectEvent = { type: "CONNECT"; providerKey: WalletProviderKey };
export type SignEvent = { type: "SIGN" };
export type Dispatch = ConnectEvent | SignEvent;

export type ConnectingEvent = {
  type: "CONNECTING";
  data: { providerKey: WalletProviderKey };
};
export type ConnectedEvent = {
  type: "CONNECTED";
  data: {
    address: string;
    addresses: string[];
    provider: SupportedProvider;
    providerKey: WalletProviderKey;
    network: NetworkItem;
  };
};
export type DisconnectedEvent = { type: "DISCONNECTED" };
export type SigningEvent = { type: "SIGNING"; data: string };
export type SignDataPreparedEvent = {
  type: "SIGN_DATA_PREPARED";
  data: string;
};
export type SingatureSettledEvent = {
  type: "SIGNATURE_SETTLED";
  data: {
    signature: string;
    publicKey: string;
    signMessageType: SignMessageRawType;
  };
};
export type ErrorEvent<T = any> = {
  type: "ERROR";
  data: T;
};
export type AuthenticatedEvent = {
  type: "AUTHENTICATED";
  data: DelegationIdentity;
};
export type RootEvent =
  // | ConnectingEvent
  | ConnectedEvent
  | DisconnectedEvent
  | SignDataPreparedEvent
  // | SigningEvent
  | SingatureSettledEvent
  | AuthenticatedEvent
  | ErrorEvent;

const init = fromPromise(async () => {
  return { connected: false };
});

const connect = fromPromise<
  ConnectedEvent["data"],
  { providerKey: WalletProviderKey },
  ConnectingEvent
>(async ({ input: { providerKey }, emit }) => {
  emit({ type: "CONNECTING", data: { providerKey } });
  const { provider, address, network, addresses } =
    await getRegisterExtension(providerKey);
  if (!provider) {
    throw new Error("Provider not found");
  }
  if (!address || !network) {
    throw new Error("Address or network not found");
  }

  return { address, addresses, network, provider, providerKey };
});

const prepare = fromPromise<
  string,
  { actor: ActorSubclass<SIWB_IDENTITY_SERVICE>; address: string }
>(async ({ input: { actor, address } }) => {
  const siwbMessage = await callPrepareLogin(actor, address);

  return siwbMessage;
});

export interface SignMessageParams {
  selectedProviderKey: WalletProviderKey;
  provider: SupportedProvider;
  address: string;
  siwbMessage: string;
}

const signMessage = fromPromise<
  SingatureSettledEvent["data"],
  SignMessageParams,
  SigningEvent
>(
  async ({
    input: { siwbMessage, provider, address, selectedProviderKey },
    emit,
  }) => {
    emit({ type: "SIGNING", data: siwbMessage });
    let signMessageType;
    if (
      selectedProviderKey === "BitcoinProvider" ||
      selectedProviderKey === "XverseProviders.BitcoinProvider" ||
      selectedProviderKey === "OrangecryptoProviders.BitcoinProvider"
    ) {
      const [addressType] = getAddressType(address);

      if (
        addressType === AddressType.P2TR ||
        addressType === AddressType.P2WPKH
      ) {
        signMessageType = { Bip322Simple: null };
      } else {
        signMessageType = { ECDSA: null };
      }
    } else {
      signMessageType = { ECDSA: null };
    }

    const signature = await provider.signMessage(siwbMessage as string);
    const publicKey = await provider.getPublicKey();

    return { signature, publicKey, signMessageType };
  }
);

const authenticate = fromPromise<
  DelegationIdentity,
  SingatureSettledEvent["data"] & {
    actor: ActorSubclass<SIWB_IDENTITY_SERVICE>;
    address: string;
  }
>(
  async ({
    input: { actor, publicKey, address, signMessageType, signature },
  }) => {
    // Important for security! A random session identity is created on each authenticate.
    const sessionIdentity = Ed25519KeyIdentity.generate();

    const sessionPublicKey = sessionIdentity.getPublicKey().toDer();

    // Logging in is a two-step process. First, the signed SIWB message is sent to the backend.
    // Then, the backend's siwb_get_delegation method is called to get the delegation.
    const loginOkResponse = await callLogin(
      actor,
      signature,
      address,
      publicKey,
      sessionPublicKey,
      signMessageType
    );
    // Call the backend's siwb_get_delegation method to get the delegation.
    const signedDelegation = await callGetDelegation(
      actor,
      address,
      sessionPublicKey,
      loginOkResponse.expiration
    );

    // Create a new delegation chain from the delegation.
    const delegationChain = createDelegationChain(
      signedDelegation,
      loginOkResponse.user_canister_pubkey
    );

    // Create a new delegation identity from the session identity and the
    // delegation chain.
    const identity = DelegationIdentity.fromDelegation(
      sessionIdentity,
      delegationChain
    );

    // Save the identity to idb storage.
    await SiwbStorage.save(sessionIdentity, delegationChain, address);

    return identity;
  }
);

export const siwbMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Dispatch,
    emitted: {} as RootEvent,
    input: {} as Pick<Context, "anonymousActor">,
  },
  actors: {
    init,
    connect,
    prepare,
    signMessage,
    authenticate,
  },
  guards: {
    isConnected: ({ context }) => context.connected,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwJYHcBGBZAhgYwAsUA7MAOhJQBcUcAbFALxKgGIIB7Ui4gNw4DW5VJlyES5SjXpMWCEvzw4aXANoAGALobNiUAAcOqFcT0gAHogCM6gOy2y6gCwA2ABxuArOqsBmKy5WADQgAJ6IblZkTgCccW4xAEyeibG26okAvpkhItj4RNxStAzMxGxgAE6VHJVk+nTKAGa1ALZkeWKFksTUJbLl8nwcSiY6OmaGxihcZpYINvaOrh7efgHBYda2TtGevnZOTlZOib62btm56Pni3HhcpHg05excPfxCHTddEmQPxCeLygQ0UyhmxHGWkmRj6syQFkQLhi6kcVk8Lk8nlsLkSMVsvkSIXCCG8Dl8bkSthsiRcuN8Tl8VxAnQKfwBQJYrCqNTqDWabW+ojZ90eYGecgUI3Bai0EwRUzhpgR80WDmc7i8Pn8gWJiE8bl2vl8BupGLc6hiKWZrLu5H0lTA+hwlS5nCKwy+tu69UdztdgylowhUN0CthJjmSOOZBi7hxTnUnnxzk2JNSqItMUidjpgRcNp+IvtfpdXJ5tXqjSoLUq7W9fwdTrLgeGwdl2mh4em8NA8xcMbjbgTSZTxz1CGOu1OceSNiOMRNTkLwrt3ygvVe7o+gmERbXqA3krbMshcq7BgjEKjCExbjIhvOxuHiSseNsE7fUUTJupL4ZTg7Cutw+oem4VNUlb8jWgoNtwYHHmCYznmGl49sqfbWHY6orFq6y6lsCBUokewHIkSaMoaXjAb83A4AArlQBBgMQNDBlu7w8J8e6rj6DFMSxbHgq2SEhihMLoTetKeA+KIuAcVgXOksQTvJLjRFYMSKf4vhaYytg0cWZD8cxrEoOxEG8lWAp1kKIF-CZgnmcJIJBqeoYSUqUmYrJ6jyT4SnODEE4XDJunYmRP6zoZa6OWZoyQKwADCADyAByaUAKJJQAKvKaFeSq0ZREOI7JspaZIksiQeEkEVxE4bgFjkLL7nxjGmUJVCJQAygAkgA4ml+UgIqkZFbeg7xgOo4VaptJkBcCSxAESZJs11y8X8KAQHQYDJelWW5SNY3XhNVgnOpDLnJRLg7HiqnVbVGK2Hibi+BtrVbUUu37f1Q0nVevaIgs2HLJqaw6pVRGvrG+zOLpA6JhinjZC1xAcBAcBmHBYCeeNmEIAAtC4E5EzJcSU1TVOvTFPrFDIZRQPjZ2E0kUQJH5NVDqcVKfiai3qGRCSEq9QsGS1uP-GKErlCzwPzMOMkZAyLgZDEriaapiYPq9hLOH5GTyXTjalgGzPdoVhNHA4OIYqkd1YsibgTrE97UuohqvsmKSMp9UsIXLlsEyDXgxNE5yeCchpTpaE7JLsOJ4hSUcXcOHgm3RHVORZ8sYSDpwhWrsb4omSS0imViZ+QcVdZAec3q4yvZimgRlxSj1ROciSpGcAQXMa1cUL9Dfnf4uxR1iItvjiH6EYyvhkFY71JImxxLlkaNAA */
  id: "siwbMachine",
  context: ({ input }) => ({
    ...input,
    connected: false,
  }),
  initial: "initializing",
  states: {
    initializing: {
      id: "initializing",
      invoke: {
        src: "init",
        onDone: {
          target: "idle",
          actions: [
            assign(({ event: { output } }) => ({
              connected: output.connected,
            })),
          ],
        },
        onError: "idle",
      },
    },
    connecting: {
      id: "connecting",
      invoke: {
        src: "connect",
        input: ({ context, event }) => ({
          providerKey:
            (event as ConnectEvent)?.providerKey ?? context.providerKey,
        }),
        onDone: {
          target: "preparing",
          actions: [
            assign(({ event: { output } }) => ({
              address: output.address,
              connected: true,
              provider: output.provider,
              providerKey: output.providerKey,
              network: output.network,
            })),
            emit(({ event: { output } }) => ({
              type: "CONNECTED",
              data: output,
            })),
          ],
        },
        onError: {
          target: "idle",
          actions: [
            emit(({ event: { error } }) => ({
              type: "ERROR",
              data: error,
            })),
          ],
        },
      },
    },
    preparing: {
      id: "preparing",
      invoke: {
        src: "prepare",
        input: ({ context }) => ({
          actor: context.anonymousActor!,
          address: context.address!,
        }),
        onDone: {
          target: "signing",
          actions: [
            assign(({ event: { output } }) => ({ siwbMessage: output })),
            emit(({ event: { output } }) => ({
              type: "SIGN_DATA_PREPARED",
              data: output,
            })),
          ],
        },
        onError: {
          target: "idle",
          actions: [
            emit(({ event: { error } }) => ({
              type: "ERROR",
              data: error,
            })),
          ],
        },
      },
    },
    signing: {
      id: "signing",
      invoke: {
        src: "signMessage",
        input: ({ context }) => ({
          siwbMessage: context.siwbMessage!,
          provider: context.provider!,
          address: context.address!,
          selectedProviderKey: context.providerKey!,
        }),
        onDone: {
          target: "authenticating",
          actions: [
            emit(({ event: { output } }) => ({
              type: "SIGNATURE_SETTLED",
              data: output,
            })),
            assign(({ event: { output } }) => ({
              publicKey: output.publicKey,
              signature: output.signature,
              signMessageType: output.signMessageType,
            })),
          ],
        },
        onError: {
          target: "idle",
          actions: [
            emit(({ event: { error } }) => ({
              type: "ERROR",
              data: error,
            })),
          ],
        },
      },
    },
    authenticating: {
      id: "authenticating",
      invoke: {
        src: "authenticate",
        input: ({ context }) => ({
          actor: context.anonymousActor!,
          publicKey: context.publicKey!,
          address: context.address!,
          signature: context.signature!,
          signMessageType: context.signMessageType!,
        }),
        onDone: {
          target: "authenticated",
          actions: [
            assign(({ event: { output } }) => ({
              identity: output,
            })),
            emit(({ event: { output } }) => ({
              type: "AUTHENTICATED",
              data: output,
            })),
          ],
        },
        onError: {
          target: "idle",
          actions: [
            emit(({ event: { error } }) => ({
              type: "ERROR",
              data: error,
            })),
          ],
        },
      },
    },
    authenticated: {
      id: "authenticated",
      on: {
        CONNECT: "connecting",
        SIGN: { target: "signing", guard: "isConnected" },
      },
    },
    idle: {
      id: "idle",
      on: {
        CONNECT: "connecting",
        SIGN: { target: "signing", guard: "isConnected" },
      },
    },
  },
});
