/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { EventEmitter } from "stream";

export type SignMessageType = "ecdsa" | "bip322-simple";

export type WalletProviderKey =
  | "wizz"
  | "unisat"
  | "atom"
  | "XverseProviders.BitcoinProvider"
  | "okxwallet.bitcoinTestnet"
  | "okxwallet.bitcoin"
  | "okxwallet.bitcoinSignet"
  | "BitcoinProvider"
  | "OrangecryptoProviders.BitcoinProvider";

export type NetworkType =
  | "testnet"
  | "testnet4"
  | "livenet"
  | "mainnet"
  | "signet"
  | "bitcoin";

export interface IBitcoinProvider extends EventEmitter {
  request(method: string, params: any): Promise<any>;
}

export interface BTCWalletBalance {
  total: number;
  confirmed: number;
  unconfirmed: number;
}

export type XverseAddressPurpose = "ordinals" | "payment";

export class BitcoinProviderMaker {
  private defaultAddress: string | undefined;
  private defaultPublickey: string | undefined;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(private providerKey: string) {
    // Initialize event listeners map
    this.eventListeners.set("accountsChanged", []);
    this.eventListeners.set("networkChanged", []);
  }

  static createProvider(
    providerKey: string = "BitcoinProvider"
  ): BitcoinProviderMaker {
    return new BitcoinProviderMaker(providerKey);
  }

  private async sendMessage<T>(type: string, payload: any = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type, wallet: this.providerKey, payload },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          if (response && response.error) {
            reject(new Error(response.error));
            return;
          }
          resolve(response as T);
        }
      );
    });
  }

  async signMessage(
    message: string,
    type?: string | SignMessageType
  ): Promise<string> {
    if (this.defaultAddress === undefined) {
      throw new Error(`Connect Wallet first`);
    }

    const [addressType, _] = getAddressType(this.defaultAddress);

    if (type) {
      if (type.toLowerCase() === "ecdsa") {
        if (
          addressType === AddressType.P2TR ||
          addressType === AddressType.P2WPKH ||
          addressType === AddressType.P2SH_P2WPKH
        ) {
          throw new Error(
            `Wallet Type: ${addressType} not supoorted for sign message type: ${type}`
          );
        }
      } else {
        if (
          addressType === AddressType.P2PKH ||
          addressType === AddressType.P2SH_P2WPKH
        ) {
          throw new Error(
            `Wallet Type: ${addressType} not supoorted for sign message type: ${type}`
          );
        }
      }
    }

    try {
      const { result: response } = await this.sendMessage<{
        result: {
          signature: string;
          address: string;
          messageHash: string;
        };
      }>("signMessage", {
        address: this.defaultAddress,
        message,
      });

      if (response?.signature) return response.signature;
      else throw new Error("User rejected request.");
    } catch (error) {
      throw error;
    }
  }

  async requestAccounts(): Promise<string[]> {
    return this.getAccounts();
  }

  async getAccounts(): Promise<string[]> {
    const { result: addresses } = await this.sendMessage<{
      result: {
        address: string;
        addressType: string;
        publicKey: string;
        purpose: XverseAddressPurpose;
      }[];
    }>("getAccounts", {
      purposes: ["ordinals", "payment"],
    });

    if (addresses) {
      this.defaultAddress =
        addresses.length > 0 ? addresses[0]!.address : undefined;
      this.defaultPublickey =
        addresses.length > 0 ? addresses[0]!.publicKey : undefined;
      return addresses.map((a) => a.address);
    } else throw new Error("User rejected request.");
  }

  async getPublicKey(): Promise<string> {
    if (this.defaultPublickey === undefined) {
      throw new Error(`Connect Wallet first`);
    }
    return this.defaultPublickey;
  }

  async getNetwork(): Promise<NetworkType> {
    if (this.defaultAddress === undefined) {
      throw new Error(`Connect Wallet first`);
    }
    return getAddressType(this.defaultAddress)[1];
  }

  async getBalance(): Promise<BTCWalletBalance> {
    try {
      return await this.sendMessage<BTCWalletBalance>("getBalance");
    } catch (error) {
      throw error;
    }
  }

  async sendBitcoin(address: string, amount: number): Promise<string> {
    try {
      return await this.sendMessage<string>("sendBitcoin", {
        recipients: [
          {
            address,
            amount,
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  on(
    event: "accountsChanged" | "networkChanged",
    listener: (data: any) => void
  ) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(listener);
    this.eventListeners.set(event, listeners);

    // Set up Chrome message listener for events only once
    if (listeners.length === 1) {
      chrome.runtime.onMessage.addListener((message) => {
        if (message.type === event && message.wallet === this.providerKey) {
          listeners.forEach((l) => l(message.data));
        }
        return true;
      });
    }

    return this;
  }

  removeListener(
    event: "accountsChanged" | "networkChanged",
    listener: (data: any) => void
  ) {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
      this.eventListeners.set(event, listeners);
    }
    return this;
  }
}

export interface IWalletProvider {
  fetchAndValidateFile(
    url: string,
    filePath: string,
    expectSHA: string
  ): Promise<string>;

  getProxy(): string | undefined;

  // Connect the current account.
  requestAccounts(): Promise<string[]>;

  getAccounts(): Promise<string[]>;

  getNetwork(): Promise<NetworkType>;

  // Get an address type, return null if the address is invalid
  getAddressType(address: string): Promise<string | null>;

  // Get current account PublicKey
  getPublicKey(): Promise<string>;

  // Sign message
  signMessage(
    message: string,
    type?: string | SignMessageType
  ): Promise<string>;

  // send Bitcoin
  sendBitcoin(address: string, amount: number): Promise<string>;

  // getBalance
  getBalance(): Promise<BTCWalletBalance>;

  getAppVersion(): Promise<string>;

  getSupportedMethods(): Promise<string[]>;

  pushTx({ rawtx }: { rawtx: string }): Promise<string>;

  pushPsbt(psbt: string): Promise<string>;

  on(
    event: "accountsChanged" | "networkChanged",
    listener: (data: any) => void
  ): this;

  removeListener(
    event: "accountsChanged" | "networkChanged",
    listener: (data: any) => void
  ): this;
}

// Generic wallet provider implementation using message passing
export class MessageBasedWalletProvider implements IWalletProvider {
  private defaultAddress: string | undefined;
  private defaultPublickey: string | undefined;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(private providerKey: WalletProviderKey) {
    this.eventListeners.set("accountsChanged", []);
    this.eventListeners.set("networkChanged", []);
  }

  private async sendMessage<T>(type: string, payload: any = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type, wallet: this.providerKey, payload },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error in sendMessage:", chrome.runtime.lastError);
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          if (response && response.error) {
            console.error("Error in response:", type, response.error);
            reject(new Error(response.error));
            return;
          }
          console.log("Response from sendMessage:", response);
          resolve(response as T);
        }
      );
    });
  }

  async fetchAndValidateFile(
    url: string,
    filePath: string,
    expectSHA: string
  ): Promise<string> {
    return this.sendMessage<string>("fetchAndValidateFile", {
      url,
      filePath,
      expectSHA,
    });
  }

  getProxy(): string | undefined {
    return undefined;
  }

  async requestAccounts(): Promise<string[]> {
    const accounts = await this.sendMessage<string[]>("requestAccounts", {});
    console.log("------------Account Result----------", accounts);
    if (accounts && accounts.length > 0) {
      this.defaultAddress = accounts[0];
    }
    return accounts;
  }

  async getAccounts(): Promise<string[]> {
    const accounts = await this.sendMessage<string[]>("getAccounts", {});
    if (accounts && accounts.length > 0) {
      this.defaultAddress = accounts[0];
    }
    return accounts;
  }

  async getNetwork(): Promise<NetworkType> {
    return this.sendMessage<NetworkType>("getNetwork");
  }

  async getAddressType(address: string): Promise<string | null> {
    return this.sendMessage<string | null>("getAddressType", { address });
  }

  async getPublicKey(): Promise<string> {
    if (this.defaultPublickey) {
      return this.defaultPublickey;
    }
    this.defaultPublickey = await this.sendMessage<string>("getPublicKey");
    return this.defaultPublickey;
  }

  async signMessage(
    message: string,
    type?: string | SignMessageType
  ): Promise<string> {
    return this.sendMessage<string>("signMessage", { message, type });
  }

  async sendBitcoin(address: string, amount: number): Promise<string> {
    return this.sendMessage<string>("sendBitcoin", { address, amount });
  }

  async getBalance(): Promise<BTCWalletBalance> {
    return this.sendMessage<BTCWalletBalance>("getBalance", {});
  }

  async getAppVersion(): Promise<string> {
    return this.sendMessage<string>("getAppVersion", {});
  }

  async getSupportedMethods(): Promise<string[]> {
    return this.sendMessage<string[]>("getSupportedMethods", {});
  }

  async pushTx({ rawtx }: { rawtx: string }): Promise<string> {
    return this.sendMessage<string>("pushTx", { rawtx });
  }

  async pushPsbt(psbt: string): Promise<string> {
    return this.sendMessage<string>("pushPsbt", { psbt });
  }

  on(
    event: "accountsChanged" | "networkChanged",
    listener: (data: any) => void
  ): this {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(listener);
    this.eventListeners.set(event, listeners);

    // Set up Chrome message listener for events only once
    if (listeners.length === 1) {
      chrome.runtime.onMessage.addListener((message) => {
        if (message.type === event && message.wallet === this.providerKey) {
          listeners.forEach((l) => l(message.data));
        }
        return true;
      });
    }

    return this;
  }

  removeListener(
    event: "accountsChanged" | "networkChanged",
    listener: (data: any) => void
  ): this {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
      this.eventListeners.set(event, listeners);
    }
    return this;
  }
}

export type SupportedProvider = BitcoinProviderMaker | IWalletProvider;

export interface NetworkItem {
  type: string;
  network: NetworkType;
}

export const NETWORKS: { [key: string]: NetworkItem } = {
  mainnet: {
    type: "livenet",
    network: "bitcoin",
  },
  testnet: {
    type: "testnet",
    network: "testnet",
  },
  testnet4: {
    type: "testnet4",
    network: "testnet",
  },
  signet: {
    type: "signet",
    network: "testnet",
  },
};

// This function is now deprecated as we're using message passing
export function getPropByKey(obj: any, key: string) {
  const keys = key.split(".");
  let result = obj;
  for (const key1 of keys) {
    if (result) {
      result = result[key1];
    }
  }
  return result;
}

export const getWalletProvider = (
  key: WalletProviderKey
): SupportedProvider => {
  switch (key) {
    case "BitcoinProvider":
    case "XverseProviders.BitcoinProvider":
    case "OrangecryptoProviders.BitcoinProvider": {
      return BitcoinProviderMaker.createProvider(key);
    }
    default: {
      return new MessageBasedWalletProvider(key);
    }
  }
};

export function isPageHidden() {
  const doc = document as any;
  return doc.hidden || doc.msHidden || doc.webkitHidden || doc.mozHidden;
}

export async function getRegisterExtension(providerKey?: WalletProviderKey) {
  const provider = providerKey ? getWalletProvider(providerKey) : undefined;
  let address: string | undefined = undefined;
  let network: NetworkItem | undefined = undefined;
  let addresses: string[] = [];

  console.log("________________Provider)_____________________", provider);

  const wp = provider;
  const accountChange = (accounts: string[]) => {
    if (isPageHidden()) {
      return;
    }
    address = accounts[0];
    addresses = accounts;
  };
  const networkChange = (_n: string) => {
    (async () => {
      if (isPageHidden()) {
        return;
      }
      if (_n === "mainnet" || _n === "livenet" || !_n) {
        network = NETWORKS.mainnet!;
      } else {
        network = NETWORKS[_n]!;
      }
    })();
  };

  const getNetwork = async () => {
    const network = await wp?.getNetwork();
    if (network) {
      networkChange(network);
    }
  };

  const requestAccounts = async () => {
    const accounts = await wp?.requestAccounts();
    if (accounts && accounts.length > 0) {
      address = accounts[0];
      addresses = accounts;
    }
  };
  if (wp) {
    if ((wp as IWalletProvider).on !== undefined) {
      (wp as IWalletProvider).on("accountsChanged", accountChange);
      (wp as IWalletProvider).on("networkChanged", networkChange);
    }

    await requestAccounts();
    await getNetwork();
    if ((wp as IWalletProvider).removeListener !== undefined) {
      (wp as IWalletProvider).removeListener("accountsChanged", accountChange);
      (wp as IWalletProvider).removeListener("networkChanged", networkChange);
    }
  }

  console.log("--------------------------Result______", address, addresses);

  return { provider, providerKey, address, network, addresses };
}

export enum AddressType {
  P2PKH,
  P2WPKH,
  P2TR,
  P2SH_P2WPKH,
}

export function getAddressType(address: string): [AddressType, NetworkType] {
  if (address.startsWith("bc1q")) {
    return [AddressType.P2WPKH, "mainnet"];
  } else if (address.startsWith("bc1p")) {
    return [AddressType.P2TR, "mainnet"];
  } else if (address.startsWith("1")) {
    return [AddressType.P2PKH, "mainnet"];
  } else if (address.startsWith("3")) {
    return [AddressType.P2SH_P2WPKH, "mainnet"];
  }
  // testnet
  else if (address.startsWith("tb1q")) {
    return [AddressType.P2WPKH, "testnet"];
  } else if (address.startsWith("m") || address.startsWith("n")) {
    return [AddressType.P2PKH, "testnet"];
  } else if (address.startsWith("2")) {
    return [AddressType.P2SH_P2WPKH, "testnet"];
  } else if (address.startsWith("tb1p")) {
    return [AddressType.P2TR, "testnet"];
  }
  throw new Error(`Unknown address: ${address}`);
}
