import type { ActorSubclass, Agent, Identity } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";
import type { Principal } from "@dfinity/principal";
import { err, ok } from "neverthrow";

import infinityLogoLight from "../assets/infinity.png";
import infinityLogoDark from "../assets/infinity.png";
import {
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  type Config,
  BaseConnector,
} from "./connectors";

type IC = {
  createActor: <T>(args: {
    canisterId: string;
    interfaceFactory: IDL.InterfaceFactory;
  }) => Promise<ActorSubclass<T>>;
  agent: Agent;
  getPrincipal: () => Promise<Principal>;
  isConnected: () => Promise<boolean>;
  disconnect: () => Promise<any>;
  requestConnect: (config: Config) => Promise<boolean>;
};

class InfinityWallet extends BaseConnector {
  #identity?: Identity;
  #principal?: string;
  #client?: any;
  #ic?: IC;

  get identity() {
    return this.#identity;
  }

  get client() {
    return this.#client;
  }

  get ic() {
    return this.#ic;
  }

  constructor(userConfig: Partial<Config> = {}) {
    super(
      {
        whitelist: [],
        host: "https://icp0.io",
        dev: true,
        providerUrl: "https://identity.ic0.app",
        ledgerCanisterId: "",
        ...userConfig,
      },
      {
        features: [],
        icon: {
          light: infinityLogoLight,
          dark: infinityLogoDark,
        },
        id: "infinity",
        name: "Bitfinity Wallet",
      }
    );
    // @ts-ignore
    this.#ic = window.ic?.infinityWallet;
  }

  // TODO: doesn't work if wallet is locked
  // test more & tell infinityswap
  async init() {
    try {
      if (!this.#ic) {
        return err({ kind: InitError.NotInstalled });
      }
      const isConnected = await this.isConnected();
      if (isConnected) {
        // Otherwise agent doesn't become available. Infinity wallet should fix
        await this.connect();
        // TODO: never finishes if user doesnt login back?
        this.#principal = (await this.#ic.getPrincipal()).toString();
      }
      return ok({ isConnected });
    } catch (e) {
      console.error(e);
      return err({ kind: InitError.InitFailed });
    }
  }

  async isConnected() {
    try {
      if (!this.#ic) {
        return false;
      }
      return await this.#ic.isConnected();
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async createActor<Service>(
    canisterId: string,
    idlFactory: IDL.InterfaceFactory
  ) {
    if (!this.#ic) {
      return err({ kind: CreateActorError.NotInitialized });
    }
    try {
      if (this.config.dev) {
        console.error("Infinity wallet doesn't support creating local actors");
        return err({
          kind: CreateActorError.LocalActorsNotSupported,
        });
      }
      const actor = await this.#ic.createActor<Service>({
        canisterId,
        interfaceFactory: idlFactory,
      });
      return ok(actor);
    } catch (e) {
      console.error(e);
      return err({ kind: CreateActorError.CreateActorFailed });
    }
  }

  async connect() {
    try {
      if (!this.#ic) {
        // TODO: customizable behaviour?
        window.open(
          "https://chrome.google.com/webstore/detail/infinity-wallet/jnldfbidonfeldmalbflbmlebbipcnle",
          "_blank"
        );
        return err({ kind: ConnectError.NotInstalled });
      }
      await this.#ic.requestConnect(this.config);
      this.#principal = (await this.#ic.getPrincipal()).toString();
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: ConnectError.ConnectFailed });
    }
  }

  async disconnect() {
    try {
      if (!this.#ic) {
        return err({ kind: DisconnectError.NotInitialized });
      }
      const ic = this.#ic;
      await Promise.race([
        new Promise((resolve, reject) => {
          // InfinityWallet disconnect promise never resolves despite being disconnected
          // This is a hacky workaround
          setTimeout(async () => {
            const isConnected = await ic.isConnected();
            if (!isConnected) {
              resolve(isConnected);
            } else {
              // TODO: return err?
              reject();
            }
          }, 10);
        }),
        ic.disconnect(),
      ]);
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: DisconnectError.DisconnectFailed });
    }
  }

  // async requestTransfer(...args) {
  //   // return this.#ic.requestTransfer(...args)
  // }

  // async queryBalance(...args) {
  //   return this.#ic.requestBalance(...args)
  // }

  // async signMessage(...args) {
  //   return this.#ic.signMessage(...args)
  // }

  //
  // getManagementCanister(...args) {
  //   return this.#ic.getManagementCanister(...args)
  // }

  // batchTransactions(...args) {
  //   return this.#ic.batchTransactions(...args)
  // }
}

export { InfinityWallet };
