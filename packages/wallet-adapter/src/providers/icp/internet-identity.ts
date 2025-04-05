import {
  Actor,
  AnonymousIdentity,
  HttpAgent,
  type Identity,
} from "@dfinity/agent";
import { AuthClient, type AuthClientCreateOptions } from "@dfinity/auth-client";
import { ok, err } from "neverthrow";

import {
  ConnectError,
  CreateActorError,
  DisconnectError,
  BaseConnector,
  type Config,
  type ConnectOptions,
  type DisconnectOptions,
} from "../base-connector";

import dfinityLogoLight from "../../assets/dfinity.svg";
import dfinityLogoDark from "../../assets/dfinity.svg";

class InternetIdentity extends BaseConnector {
  constructor(config: Partial<Config> = {}) {
    super(
      {
        dev: false,
        whitelist: [],
        host: "https://icp0.io",
        providerUrl: "https://identity.ic0.app",
        ...config,
      },
      {
        features: [],
        icon: {
          light: dfinityLogoLight,
          dark: dfinityLogoDark,
        },
        id: "ii",
        name: "Internet Identity",
      }
    );
  }

  async createActor<Service>(canisterId: string, idlFactory: any) {
    try {
      const agent = new HttpAgent({
        ...this.config,
        identity: this.authClient?.getIdentity(),
      });

      if (agent.isLocal()) {
        const res = await agent
          .fetchRootKey()
          .then(() => ok(true))
          .catch((e) => err({ kind: CreateActorError.FetchRootKeyFailed }));
        if (res.isErr()) {
          return res;
        }
      }
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

  async connect(options?: ConnectOptions) {
    try {
      if (!this.authClient) {
        return err({ kind: ConnectError.NotInitialized });
      }
      await this.authClient.login(options);
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: ConnectError.ConnectFailed });
    }
  }

  async disconnect(options?: DisconnectOptions) {
    try {
      if (!this.authClient) {
        return err({ kind: DisconnectError.NotInitialized });
      }
      await this.authClient.logout(options);
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: DisconnectError.DisconnectFailed });
    }
  }
}

export { InternetIdentity };
