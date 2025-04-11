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

import nfidLogoLight from "../../assets/nfid.png";
import nfidLogoDark from "../../assets/nfid.png";

class Nfid extends BaseConnector {
  constructor(config: Partial<Config> = {}) {
    super(config, {
      id: "nfid",
      name: "NFID",
      type: ConnectorType.ICP,
      features: [],
      icon: {
        light: nfidLogoLight,
        dark: nfidLogoDark,
      },
      link: "https://nfid.one/",
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
      const APP_NAME = "Strike";
      const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
      const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;
      const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;

      await new Promise((resolve, reject) => {
        this.authClient!.login({
          identityProvider,
          ...options,
          onSuccess: async () => {
            window.localStorage.setItem("lastConnectedWalletId", "nfid");
            resolve(true);
          },
          onError: (error) => {
            console.error("NFID login failed:", error);
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

export { Nfid };
