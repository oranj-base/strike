import { type ActorSubclass } from "@dfinity/agent";
import {
  AuthClient,
  type AuthClientCreateOptions,
  type AuthClientLoginOptions,
} from "@dfinity/auth-client";
import type { IDL } from "@dfinity/candid";
import type { Result } from "neverthrow";

type CustomError<T> = { kind: T; message?: string };

export interface BTCWalletConfig {
  id: string;
  name: string;
  lightLogo: string;
  darkLogo: string;
  link: string;
}

export type Config = {
  whitelist: Array<string>;
  host: string;
  dev: boolean;
  autoConnect?: boolean;
  providerUrl?: string;
  ledgerCanisterId?: string;
  ledgerHost?: string;
  appName?: string;
  btcWallet?: BTCWalletConfig;
  send?: any;
  siwbActorRef?: any;
  delegationModes?: Array<any>;
  onConnectionUpdate?: () => void;
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

export interface Meta {
  features: Array<string>;
  icon: {
    light: string;
    dark: string;
  };
  id: string;
  name: string;
}

export type ConnectOptions = AuthClientLoginOptions & {
  delegationModes: Array<string>;
  derivationOrigin?: string;
};

export type DisconnectOptions = {
  returnTo?: string;
};

export abstract class BaseConnector {
  config: Config;
  meta: Meta;
  authClient?: AuthClient;

  constructor(config: Config, meta: Meta) {
    this.config = config;
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
