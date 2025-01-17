import type { BaseConnector, IWalletConnector } from "./connectors";
import { InternetIdentity } from "./internet-identity";
import { BTCWalletConnector } from "./btcWalletConnector";
// import { NFID } from "./nfid";
// import { InfinityWallet } from "./bitfinity-wallet";
// import { PlugWallet } from "./plug-wallet";

export * from "./connectors";
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
  return [
    new InternetIdentity(config),
    // new NFID(config),
    // new InfinityWallet(config),
    // new PlugWallet(config),
  ];
}

export function walletProviders(
  config: Config | undefined = {}
): Array<WalletProvider> {
  return [];
}

export { InternetIdentity, BTCWalletConnector };
