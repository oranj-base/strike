import { Actor, HttpAgent } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";
import { DelegationIdentity } from "@dfinity/identity";
import { err, ok } from "neverthrow";
import {
  ConnectError,
  CreateActorError,
  DisconnectError,
  type Config,
  type BTCWalletConfig,
  BaseConnector,
} from "./base-connector";

const idleTimeout = 2 * 7 * 24 * 3600 * 1000;

class BTCWalletConnector extends BaseConnector {
  #send: any;
  #siwbActorRef: any;
  #wallet: BTCWalletConfig;

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

  async isConnected() {
    try {
      if (!this.authClient) {
        return false;
      }
      return await this.authClient!.isAuthenticated();
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
        identity: this.identity,
      });
      const actor = Actor.createActor<Service>(idlFactory, {
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
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: ConnectError.ConnectFailed });
    }
  }

  async disconnect() {
    try {
      await this.authClient?.logout();
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: DisconnectError.DisconnectFailed });
    }
  }
}

export { BTCWalletConnector };
