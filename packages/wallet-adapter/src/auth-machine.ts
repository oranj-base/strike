import { assign, setup, fromPromise, emit, log } from "xstate";
import { type DisconnectResult, type BaseConnector } from "./providers";

type Provider = BaseConnector;

export type RootContext = {
  host: string;
  autoConnect: boolean;
  whitelist: Array<string>;
  principal?: string;
  activeProvider?: Provider;
  providers: Array<Provider>;
  connectingProvider?: string;
};

export type ConnectEvent = {
  type: "CONNECT";
  data: {
    provider?: string;
    derivationOrigin?: string;
    canisterId?: string;
    siwbCanisterId?: string;
  };
};
export type CancelConnectEvent = { type: "CANCEL_CONNECT" };
export type DisconnectEvent = { type: "DISCONNECT" };

export type ConncetedEvent = {
  type: "CONNECTED";
  data: { activeProvider: Provider };
};
type DisconnectedEvent = { type: "DISCONNECTED" };
type ErrorEvent = { type: "ERROR"; data: { error: any } };

export type Dispatch = ConnectEvent | CancelConnectEvent | DisconnectEvent;

export type RootEvent = ConncetedEvent | DisconnectedEvent | ErrorEvent;

export const init = fromPromise<
  { activeProvider: Provider; principal?: string },
  { providers: Provider[] }
>(async ({ input: { providers } }) => {
  const initResult = await Promise.all(providers.map((p) => p.init()));
  let connectedProviders = providers.map(
    (p) =>
      new Promise<Provider>(async (resolve, reject) => {
        const isConnected = await p.isConnected();
        isConnected ? resolve(p) : reject();
      })
  );
  const connectedProvider = await Promise.any(connectedProviders);
  const principal = connectedProvider.principal;
  return {
    activeProvider: connectedProvider,
    principal: principal?.toString(),
  };
});

export const handleConnectRequest = fromPromise<
  { activeProvider: Provider; principal?: string },
  {
    providerId?: string;
    derivationOrigin?: string;
    canisterId?: string;
    siwbCanisterId?: string;
    providers: Provider[];
  }
>(
  async ({
    input: {
      providerId,
      derivationOrigin,
      canisterId,
      siwbCanisterId,
      providers,
    },
  }) => {
    const provider2Connect =
      providerId ?? (localStorage.getItem("icp:provider") as string);

    if (!provider2Connect) {
      throw new Error("Provider not found");
    }

    const provider = providers.find((p) => p.meta.id === provider2Connect);
    if (!provider) {
      throw new Error("Provider not found");
    }

    // await provider.createSIWBXActor(siwbCanisterId)

    const result = await provider.connect({
      delegationModes: [],
      derivationOrigin,
      canisterId,
      siwbCanisterId,
    });

    if (result.isErr()) {
      throw new Error(result.error.message ?? JSON.stringify(result.error));
    }

    const connected = result.value;

    if (!connected) {
      throw new Error("Error while connecting");
    }

    localStorage.setItem("icp:provider", provider.meta.id);
    const principal = provider.identity;

    return {
      activeProvider: provider,
      principal: principal?.toString(),
    };
  }
);

export const handleDisconnectRequest = fromPromise<
  DisconnectResult,
  { activeProvider: Provider }
>(async ({ input: { activeProvider } }) => {
  const result = await activeProvider.disconnect();
  return result;
});

export const createAuthMachine = (initialContext: RootContext) => {
  const machine = setup({
    types: {
      context: {} as RootContext,
      events: {} as Dispatch,
      emitted: {} as RootEvent,
    },
    actors: {
      init,
      handleConnectRequest,
      handleDisconnectRequest,
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QEECuAXAFgWQIYGNMBLAOzADpSj0jcAbIgL1KgGIIB7MykgNw4DWFKugDaABgC6iUAAcOsakS4yQAD0QAWAOwAmcgE4jR3QFZtARiMA2AwBoQAT0QXdADkPGDb0xbcBmU3FNNwBfUIc0LDxCUmESJXomFlYwACc0jjTyWTpcdAAzLIBbHmoJaSQQeUUaFSqNBB19LwMzSxt7J0Q3C3Ig8XF-V21LC3EDcMiMHAJibiIIOjBWAGEAeQA5TYBRVYAVCtUapXrQRutxU3J-TX9tCYMh601rawdnBF1dPoNTYfcBmGbwsgSmICis1i3HwXDI+BoJDYnAWfEEFEwuBISzAqzhYARACUwABHVBwMRSY4KU4kVSNZqeYztKwGWwfLQWa5Paz+H5AtwPHTWcGQmLzCiwkjwxFsdKZbK5fJFNKlTHY5Z46UE9DEskUo5VE51OkNLR6Jkmcys9ndL4WzT-CbWCyg3maNmimbiuLkKUylKrZCbVY7AAyAH0Nts9ocqUaaSb6eaWl4WZ0OQh-NZrppxNZvjndLZHQZNF7onNff6dZA1ltdgdDXJE8pTedEJdrrd7o9njpM0EPD4y6ZdIFdOIuS8K1CJX78Qi6wARACSAGVo4245UW7U28mEKY3OJyJcgf4AgZtG83LpM5drOQR47xG4nq4LOWIhDvVXuBARCwDWCIpCi8T8EI5Dqjiy5ASBuqkuSsCUru1Stmc6gppabTWhmdqmKYBg3ERITZiEbi9GEP5iv+FCAcBi6yqkGRZDkeSFCU0FYrB8FMXqyGodS+6YQyFqtOmbJdJ8ObaCRZZ3n4tiCiK4IkBwEBwKotHQmAwm0oeAC07x2oZ3KtBZ166LOPqookDDMEi+lJmaXymE+xbueOoy6B6J7+JmrotDex4FoWTyvDZdGUDizkHq5oz+P0XJEVJbiaBY2huJmujaElmXXuMZjjIMoJRbpC7aqBTkJiJ7ZYU0+iDIMLyuiEbSaJomadfogRlncLXFkY5XzghkBxaJiCJclhGdOlmXZXaZHyY67gWAWObUdMlYVQxCEsBN9UMveBF-IY6Wdf4ALpTm4ThEAA */
    id: "AuthMachine",
    initial: "initializing",
    context: initialContext,
    states: {
      initializing: {
        id: "initializing",
        invoke: {
          id: "init",
          src: "init",
          input: ({ context }) => ({
            providers: context.providers,
          }),
          onDone: {
            target: "connected",
            actions: [
              assign(({ event }) => ({
                activeProvider: event.output.activeProvider,
                principal: event.output.principal,
              })),
            ],
          },
          onError: {
            target: "idle",
          },
        },
      },
      idle: {
        id: "idle",
        on: {
          CONNECT: {
            target: "connecting",
          },
        },
        entry: [
          assign({
            activeProvider: () => undefined,
          }),
        ],
      },
      connecting: {
        id: "connecting",
        invoke: {
          id: "handleConnectRequest",
          src: "handleConnectRequest",
          input: ({ event, context }) => ({
            providerId: (event as ConnectEvent).data.provider,
            derivationOrigin: (event as ConnectEvent).data.derivationOrigin,
            canisterId: (event as ConnectEvent).data.canisterId,
            siwbCanisterId: (event as ConnectEvent).data.siwbCanisterId,
            providers: context.providers,
          }),
          onDone: {
            target: "connected",
            actions: [
              assign(({ event }) => ({
                activeProvider: event.output.activeProvider,
                principal: event.output.principal,
              })),
            ],
          },
          onError: {
            target: "idle",
            actions: [
              emit(({ event }) => ({
                type: "ERROR",
                data: { error: event.error },
              })),
            ],
          },
        },
        on: {
          CANCEL_CONNECT: {
            target: "idle",
          },
        },
      },
      connected: {
        id: "connected",
        on: {
          CONNECT: {
            target: "connecting",
          },
          DISCONNECT: {
            target: "disconnecting",
          },
        },
        entry: [
          emit(({ context }) => ({
            type: "CONNECTED",
            data: { activeProvider: context.activeProvider! },
          })),
        ],
      },
      disconnecting: {
        id: "disconnecting",
        invoke: {
          id: "handleDisconnectRequest",
          src: "handleDisconnectRequest",
          input: ({ context }) => ({
            activeProvider: context.activeProvider!,
            providers: context.providers,
          }),
          onDone: {
            target: "idle",
            actions: [],
          },
          onError: {
            target: "connected",
          },
        },
      },
    },
  });

  return machine;
};
