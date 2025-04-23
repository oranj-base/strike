import { type ActorSubclass } from "@dfinity/agent";
import {
  AuthClient,
  type AuthClientCreateOptions,
  type AuthClientLoginOptions,
} from "@dfinity/auth-client";
import type { IDL } from "@dfinity/candid";
import type { Result } from "neverthrow";

type CustomError<T> = { kind: T; message?: string };

export type Config = {
  whitelist: Array<string>;
  host: string;
  autoConnect: boolean;
  providerUrl?: string;
  ledgerCanisterId?: string;
  ledgerHost?: string;
  appName?: string;
  delegationModes?: Array<any>;
  onConnectionUpdate?: () => void;
};

export const defaultConfig: Config = {
  autoConnect: true,
  host: "https://icp0.io",
  providerUrl: "https://identity.ic0.app",
  whitelist: [],
};

export enum CreateActorError {
  FetchRootKeyFailed = "FETCH_ROOT_KEY_FAILED",
  CreateActorFailed = "CREATE_ACTOR_FAILED",
  NotInitialized = "NOT_INITIALIZED",
  LocalActorsNotSupported = "LOCAL_ACTORS_NOT_SUPPORTED",
}

export type CreateActorResult<Service> = Result<
  ActorSubclass<Service>,
  CustomError<CreateActorError>
>;

export enum ConnectError {
  NotInitialized = "NOT_INITIALIZED",
  NotInstalled = "NOT_INSTALLED",
  ConnectFailed = "CONNECT_FAILED",
  IsLocked = "IS_LOCKED",
}

export type ConnectResult = Result<boolean, CustomError<ConnectError>>;

export enum DisconnectError {
  DisconnectFailed = "DISCONNECT_FAILED",
  NotInitialized = "NOT_INITIALIZED",
}

export type DisconnectResult = Result<boolean, CustomError<DisconnectError>>;

export enum ConnectorType {
  ICP,
  BTC,
  ETH,
  SOL,
}

export interface Meta {
  type: ConnectorType;
  features: Array<string>;
  icon: {
    light: string;
    dark: string;
  };
  id: string;
  name: string;
  link: string;
}

export type ConnectOptions = AuthClientLoginOptions & {
  delegationModes: Array<string>;
  derivationOrigin?: string;
  canisterId?: string;
  siwbCanisterId?: string;
};

export type DisconnectOptions = {
  returnTo?: string;
};

export abstract class BaseConnector<M = Meta> {
  config: Config;
  meta: M;
  authClient?: AuthClient;

  constructor(config: Partial<Config>, meta: M) {
    this.config = { ...defaultConfig, ...config };
    this.meta = meta;
  }

  async init(options?: AuthClientCreateOptions) {
    this.authClient = await AuthClient.create(options);
  }

  abstract connect(options?: ConnectOptions): Promise<ConnectResult>;
  abstract disconnect(options?: DisconnectOptions): Promise<DisconnectResult>;

  async isConnected(): Promise<boolean> {
    if (!this.authClient) {
      return false;
    }
    const isConnected = await this.authClient.isAuthenticated();
    return isConnected;
  }

  get principal() {
    return this.identity?.getPrincipal();
  }

  get identity() {
    if (!this.authClient) {
      return undefined;
    }
    const identity = this.authClient.getIdentity();
    if (identity) {
      return identity;
    }
    return undefined;
  }

  abstract createActor<Service>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory,
    config?: {}
  ): Promise<CreateActorResult<Service>>;
}
