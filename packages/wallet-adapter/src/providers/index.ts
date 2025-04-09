import {
  defaultConfig,
  type BaseConnector,
  type Config,
} from "./base-connector";
import type { IWalletConnector } from "./wallet-connector";
import { InternetIdentity } from "./icp";

export * from "./btc";

export * from "./base-connector";
export * from "./wallet-connector";
export type Provider = BaseConnector & Partial<IWalletConnector>;
export type WalletProvider = BaseConnector & IWalletConnector;

export function defaultProviders(
  config: Config = defaultConfig
): Array<Provider> {
  return [new InternetIdentity(config)];
}

export function walletProviders(
  config: Config = defaultConfig
): Array<WalletProvider> {
  return [];
}

export { InternetIdentity };
