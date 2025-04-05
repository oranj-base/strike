import type { BaseConnector } from "./base-connector";
import type { IWalletConnector } from "./wallet-connector";
import { InternetIdentity } from "./icp/internet-identity";
import { BTCWalletConnector } from "./siwb-connector";

export * from "./base-connector";
export * from "./wallet-connector";
export type Provider = BaseConnector & Partial<IWalletConnector>;
export type WalletProvider = BaseConnector & IWalletConnector;

export type Config = {
  whitelist?: Array<string>;
  host?: string;
  autoConnect?: boolean;
  providerUrl?: string;
  ledgerCanisterId?: string;
  ledgerHost?: string;
  appName?: string;
  delegationModes?: Array<any>;
};

export function defaultProviders(
  config: Config | undefined = {}
): Array<Provider> {
  return [new InternetIdentity(config)];
}

export function walletProviders(
  config: Config | undefined = {}
): Array<WalletProvider> {
  return [];
}

export { InternetIdentity, BTCWalletConnector };
