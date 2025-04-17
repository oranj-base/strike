import type { Result } from "neverthrow";

type CustomError<T> = { kind: T; message?: string };

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
  