import { Actor, HttpAgent } from "@dfinity/agent";
import { ok, err } from "neverthrow";

import {
  ConnectError,
  CreateActorError,
  DisconnectError,
  BaseConnector,
  type Config,
  type ConnectOptions,
  type DisconnectOptions,
  ConnectorType,
} from "../base-connector";

import dfinityLogoLight from "../../assets/dfinity.svg";
import dfinityLogoDark from "../../assets/dfinity.svg";

class InternetIdentity extends BaseConnector {
  constructor(config: Partial<Config> = {}) {
    super(config, {
      id: "ii",
      name: "Internet Identity",
      type: ConnectorType.ICP,
      features: [],
      icon: {
        light: dfinityLogoLight,
        dark: dfinityLogoDark,
      },
      link: "https://identity.ic0.app/",
    });
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
      await new Promise((resolve, reject) => {
        this.authClient!.login({
          ...options,
          onSuccess: async () => {
            window.localStorage.setItem("lastConnectedWalletId", "ii");
            resolve(true);
          },
          onError: async (error) => {
            reject(error);
          },
          windowOpenerFeatures: `
          left=${window.screen.width / 2 - 525 / 2},
          top=${window.screen.height / 2 - 705 / 2},
          toolbar=0,location=0,menubar=0,width=525,height=705`,
        });
      });
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: ConnectError.ConnectFailed, message: e });
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
