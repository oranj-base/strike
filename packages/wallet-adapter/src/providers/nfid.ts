import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent, type Identity } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import { ok, err } from "neverthrow";

import nfidLogoLight from "../assets/nfid.png";
import nfidLogoDark from "../assets/nfid.png";
import {
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  BaseConnector,
} from "./connectors";

class NFID extends BaseConnector {
  #identity?: Identity;
  #principal?: string;
  #client?: AuthClient;

  get identity() {
    return this.#identity;
  }

  get client() {
    return this.#client;
  }

  constructor(userConfig = {}) {
    super(
      {
        whitelist: [],
        host: "https://icp0.io",
        providerUrl: "https://nfid.one",
        appName: "my-ic-app",
        dev: true,
        ...userConfig,
      },
      {
        features: [],
        icon: {
          light: nfidLogoLight,
          dark: nfidLogoDark,
        },
        id: "nfid",
        name: "NFID",
      }
    );
  }

  async init() {
    try {
      // TODO: pass in config or not?
      this.#client = await AuthClient.create();
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
      return await this.#client.isAuthenticated();
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
      // TODO: allow passing identity?
      const agent = new HttpAgent({
        ...this.config,
        identity: this.#identity,
      });

      if (this.config.dev) {
        // Fetch root key for certificate validation during development
        const res = await agent
          .fetchRootKey()
          .then(() => ok(true))
          .catch((e) => err({ kind: CreateActorError.FetchRootKeyFailed }));
        if (res.isErr()) {
          return res;
        }
      }
      // TODO: add actorOptions?
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
      await new Promise((resolve, reject) => {
        if (!this.#client) {
          return err({ kind: ConnectError.NotInitialized });
        }
        this.#client.login({
          identityProvider: `https://nfid.one/authenticate/?applicationName=${this.config.appName}`,
          onSuccess: resolve,
          onError: reject,
        });
      });
      if (!this.#client) {
        return err({ kind: ConnectError.NotInitialized });
      }
      this.#identity = this.#client.getIdentity();
      this.#principal = this.#identity.getPrincipal().toString();

      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: ConnectError.ConnectFailed });
    }
  }

  async disconnect() {
    try {
      if (!this.#client) {
        return err({ kind: DisconnectError.NotInitialized });
      }
      await this.#client.logout();
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: DisconnectError.DisconnectFailed });
    }
  }
}

export { NFID };
