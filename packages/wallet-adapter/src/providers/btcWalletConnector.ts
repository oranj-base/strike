import type { Identity } from "@dfinity/agent";
import { Actor, HttpAgent } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";
import { AuthClient } from "@dfinity/auth-client";
import { DelegationIdentity } from "@dfinity/identity";
import { err, ok } from "neverthrow";
import { SiwbStorage } from "@oranjbase/ic-siwb-js";
import {
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  type Config,
  type BTCWalletConfig,
  BaseConnector,
} from "./connectors";

const idleTimeout = 2 * 7 * 24 * 3600 * 1000;

class BTCWalletConnector extends BaseConnector {
  #identity?: Identity;
  #principal?: string;
  #client?: AuthClient;
  #send: any;
  #siwbActorRef: any;
  #wallet: BTCWalletConfig;
  get identity() {
    return this.#identity;
  }

  get client() {
    return this.#client;
  }

  constructor(userConfig: Partial<Config> = {}) {
    super(
      {
        whitelist: [],
        host: "https://icp0.io",
        dev: true,
        ...userConfig,
      },
      {
        features: ["wallet"],
        icon: {
          light: userConfig.btcWallet!.lightLogo,
          dark: userConfig.btcWallet!.darkLogo,
        },
        id: userConfig.btcWallet!.id,
        name: userConfig.btcWallet!.name,
      }
    );
    this.#send = userConfig.send;
    this.#siwbActorRef = userConfig.siwbActorRef;
    this.#wallet = userConfig.btcWallet!;
  }

  async init() {
    try {
      this.#client = await AuthClient.create({
        storage: new SiwbStorage(),
        keyType: "Ed25519",
        idleOptions: {
          idleTimeout,
        },
      });
      const isConnected = await this.isConnected();
      if (isConnected) {
        this.#identity = this.#client.getIdentity();
        this.#principal = this.#identity?.getPrincipal().toString();
      }
      return ok({ isConnected });
    } catch (e) {
      console.error(e);
      return err({ kind: InitError.InitFailed });
    }
  }

  async isConnected() {
    try {
      if (!this.#client) {
        return false;
      }
      return await this.#client!.isAuthenticated();
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async createActor<Service>(
    canisterId: string,
    idlFactory: IDL.InterfaceFactory
  ) {
    try {
      if (this.config.dev) {
        console.error("Infinity wallet doesn't support creating local actors");
        return err({
          kind: CreateActorError.LocalActorsNotSupported,
        });
      }
      const agent = new HttpAgent({
        ...this.config,
        identity: this.#identity,
      });
      const actor = await Actor.createActor<Service>(idlFactory, {
        agent,
        canisterId,
      });
      return ok(actor);
    } catch (e) {
      console.error(e);
      return err({ kind: CreateActorError.CreateActorFailed });
    }
  }

  async connect() {
    try {
      console.log("test ", this.#wallet);
      this.#send({
        type: "CONNECT",
        providerKey: this.#wallet.id,
      });
      const identity = await new Promise<DelegationIdentity>((resolve) => {
        this.#siwbActorRef.on(
          "AUTHENTICATED",
          (event: {
            data: DelegationIdentity | PromiseLike<DelegationIdentity>;
          }) => {
            resolve(event.data);
          }
        );
      });
      console.info("Principal ", identity.getPrincipal());
      this.#identity = identity;
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: ConnectError.ConnectFailed });
    }
  }

  async disconnect() {
    try {
      await this.#client?.logout();
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: DisconnectError.DisconnectFailed });
    }
  }
}

export { BTCWalletConnector };
