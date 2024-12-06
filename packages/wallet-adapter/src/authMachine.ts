import { assign, setup, fromPromise, emit } from "xstate";
import { type DisconnectResult, type BaseConnector } from "./providers";

type Provider = BaseConnector;

export type RootContext = {
  host: string;
  dev: boolean;
  autoConnect: boolean;
  whitelist: Array<string>;
  principal?: string;
  activeProvider?: Provider;
  providers: Array<Provider>;
  connectingProvider?: string;
};

export type ConnectEvent = {
  type: "CONNECT";
  data: { provider?: string; derivationOrigin?: string };
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

export const createAuthMachine = (initialContext: RootContext) => {
  const machine = setup({
    types: {
      context: {} as RootContext,
      events: {} as Dispatch,
      emitted: {} as RootEvent,
    },
    actors: {
      init: fromPromise<
        { activeProvider: Provider; principal: string },
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
        return {
          activeProvider: connectedProvider,
          principal: connectedProvider.principal!,
        };
      }),
      handleConnectRequest: fromPromise<
        { activeProvider: Provider; principal: string },
        {
          providerId?: string;
          derivationOrigin?: string;
          providers: Provider[];
        }
      >(async ({ input: { providerId, derivationOrigin, providers } }) => {
        const provider2Connect =
          providerId ?? (localStorage.getItem("icp:provider") as string);
        if (!provider2Connect) {
          throw new Error("Provider not found");
        }

        const provider = providers.find((p) => p.meta.id === provider2Connect);
        if (!provider) {
          throw new Error("Provider not found");
        }
        const result = await provider.connect();

        return result.match(
          (connected) => {
            if (!connected) {
              throw new Error("Error while connecting");
            }
            localStorage.setItem("icp:provider", provider.meta.id);
            return {
              activeProvider: provider,
              principal: provider.principal!,
            };
          },
          (e) => {
            console.error(e);
            throw new Error("error while connecting");
          }
        );
      }),
      handleDisconnectRequest: fromPromise<
        DisconnectResult,
        { activeProvider: Provider }
      >(async ({ input: { activeProvider } }) => {
        const result = await activeProvider.disconnect();
        return result;
      }),
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QEECuAXAFgWQIYGNMBLAOzADpSj0jcAbIgL1KgGIIB7MykgNw4DWFKugDaABgC6iUAAcOsakS4yQAD0QAWAGwBmcuMPiATAE5dADmObTx7ZoA0IAJ6IAjOfIBWY7s0B2TS9TLy9NN3sAX0inNCw8QlJhEiV6JhZWMAAnLI4s8lk6XHQAMzyAWx5qCWkkEHlFGhU6jQQdfSMTcysbO0cXRF1-U3JNM383cXtTbRmvaNiMHAJibiIIOjBWAGEAeQA5fYBRbYAVGtUGpWbQVottLwNzfy9DXS8XrydXBF03TXIIT+Xl0DzC4n8ul0CxAcWWiW4+C4ZHw6EgrAAIgBJADKe0OJ3OUkuCmuJFUrQ+xm8z1C4lB2npum+iFM4nIbmMr05FiGPNCMLhCVWFAgRFgSJIKJoJDYnDWfEEFEwuBIGzAGPFkulACUwABHVBwMTEupXJrklpaPQGIxmSzWWz2FkIYz3Ub+B5O4x2DxuQVLYVJchiiXIsCojLZXL5QrFMpZSoqtWbTVhqUR9B6w3Gi5m0kWinWjp27qOvoutyWcjaLniTmmGaN0HQmEkDgQOCqIUrJIkxrKS23RAAWm0LpHj0b05ns9bi3ivYVqQYzFl-bJRddXm05DsO6CHm0Fhe-xdximtredisQzdxgDi4RwnVG8LVoQkN39M5NnEmimNwvDcF1gVGEF-ihLk3X8CxH3hEVyG1TMWDfQct0mek9weWtHT8H0QIGV1YMBCCQRsUIxmMfx4KDRFw1RSA0JudREEhfRXjecRglsLwLErACOTrEwIleaxtFopdRS1BiZSgZih1YtpjBdCw3G8To9DdWtLE0aJoiAA */
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
              emit({
                type: "ERROR",
                data: { error: "Error while connecting" },
              }),
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
