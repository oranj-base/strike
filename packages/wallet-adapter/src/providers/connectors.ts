import { type ActorSubclass, type Identity } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";
import type { Result } from "neverthrow";

type CustomError<T> = { kind: T; message?: string };

export type Config = {
  whitelist: Array<string>;
  host: string;
  dev: boolean;
  autoConnect?: boolean;
  providerUrl?: string;
  ledgerCanisterId?: string;
  ledgerHost?: string;
  appName?: string;
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

export enum InitError {
  NotInstalled = "NOT_INSTALLED",
  InitFailed = "INIT_FAILED",
  FetchRootKeyFailed = "FETCH_ROOT_KEY_FAILED",
}

export type InitResult = Result<
  { isConnected: boolean },
  CustomError<InitError>
>;

export interface Meta {
  features: Array<string>;
  icon: {
    light: string;
    dark: string;
  };
  id: string;
  name: string;
}

export interface ConnectOptions {
  delegationModes: Array<string>;
  derivationOrigin?: string;
}

export abstract class BaseConnector {
  config: Config;
  meta: Meta;
  principal?: string;
  constructor(config: Config, meta: Meta) {
    this.config = config;
    this.meta = meta;
  }

  abstract init(): Promise<InitResult>;
  abstract isConnected(): Promise<boolean>;
  abstract createActor<Service>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory,
    config?: {}
  ): Promise<CreateActorResult<Service>>;
  abstract connect(options?: ConnectOptions): Promise<ConnectResult>;
  abstract disconnect(): Promise<DisconnectResult>;
  abstract get identity(): Identity | undefined;

  updateConfig(config: Config) {
    this.config = config;
  }
}

export enum BalanceError {
  NotInitialized = "NOT_INITIALIZED",
  QueryBalanceFailed = "QUERY_BALANCE_FAILED",
}

export type BalanceResult = Result<
  Array<{
    amount: number;
    canisterId: string;
    decimals: number;
    image?: string;
    name: string;
    symbol: string;
  }>,
  CustomError<BalanceError>
>;

export enum TokensError {
  NotInitialized = "NOT_INITIALIZED",
  QueryBalanceFailed = "QUERY_BALANCE_FAILED",
}

export type TokensResult = Result<
  Array<{
    amount: number;
    canisterId: string;
    decimals: number;
    image?: string;
    name: string;
    symbol: string;
  }>,
  CustomError<TokensError>
>;

export enum NFTsError {
  NotInitialized = "NOT_INITIALIZED",
  QueryBalanceFailed = "QUERY_BALANCE_FAILED",
}

export type NFTsResult = Result<
  Array<{
    amount: number;
    canisterId: string;
    decimals: number;
    image?: string;
    name: string;
    symbol: string;
  }>,
  CustomError<NFTsError>
>;

export enum TransferError {
  InsufficientBalance = "INSUFFICIENT_BALANCE",
  TransferFailed = "TRANSFER_FAILED",
  FaultyAddress = "FAULTY_ADDRESS",
  NotInitialized = "NOT_INITIALIZED",
  TokenNotSupported = "TOKEN_NOT_SUPPORTED",
  NotConnected = "NOT_CONNECTED",
}

export type TransferResult = Result<
  { height: number; transactionId?: string },
  CustomError<TransferError>
>;
export type NFTTransferResult = Result<
  { transactionId?: string },
  CustomError<TransferError>
>;

export enum SignError {
  NotConnected = "NOT_CONNECTED",
  NotInitialized = "NOT_INITIALIZED",
}

export type SignResult = Result<{ height: number }, CustomError<SignError>>;

export interface IWalletConnector {
  requestTransfer: (args: {
    amount: number;
    to: string;
    symbol?: string;
    standard?: string;
    decimals?: number;
    fee?: number;
    memo?: bigint;
    createdAtTime?: Date;
    fromSubAccount?: number;
  }) => Promise<TransferResult>;
  requestTransferNFT?: (args: {
    to: string;
    tokenIdentifier: string;
    tokenIndex: number;
    canisterId: string;
    standard: "ICP" | "DIP20" | "EXT" | "DRC20" | string;
    fee?: number;
    memo?: bigint;
    createdAtTime?: Date;
    fromSubAccount?: number;
  }) => Promise<NFTTransferResult>;
  wallets: Array<{
    accountId: string;
    principal: string;
  }>;
  queryBalance: () => Promise<BalanceResult>;
  // queryTokens: () => Promise<TokensResult>
  // queryNFTs: () => Promise<NFTsResult>
  // TODO:
  signMessage?: (msg: any) => Promise<SignResult>;
  // getManagementCanister: (any) => Promise<any>
  // callClientRPC: (any) => Promise<any>
  // requestBurnXTC: (any) => Promise<any>
  // batchTransactions: (any) => Promise<any>
}

// type ProviderOptions = {
//   connector: BaseConnector,
// }
