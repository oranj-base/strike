import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import type { IDL } from "@dfinity/candid";
import { DelegationIdentity } from "@dfinity/identity";
import {
  siwbMachine,
  createActor as createSIWBActor,
  type WalletProviderKey,
} from "@oranjbase/ic-siwb-js";
import { err, ok } from "neverthrow";
import { createActor, Actor as XActor } from "xstate";

import {
  ConnectError,
  CreateActorError,
  DisconnectError,
  type Config,
  BaseConnector,
  ConnectorType,
  type Meta,
} from "../base-connector";

export type SIWBMeta = Omit<Meta, "type"> & {
  siwbCanisterId: string;
  siwbActor?: ReturnType<typeof createSIWBActor>;
  siwbXActor?: XActor<typeof siwbMachine>;
};

class SIWBConnector extends BaseConnector {
  private siwbXActor: XActor<typeof siwbMachine>;

  constructor(config: Partial<Config>, meta: SIWBMeta) {
    super(config, {
      ...meta,
      type: ConnectorType.BTC,
    });

    const actor =
      meta.siwbActor ??
      createSIWBActor(meta.siwbCanisterId, {
        agentOptions: { host: config.host },
      });

    this.siwbXActor =
      meta.siwbXActor ??
      createActor(siwbMachine, {
        input: { anonymousActor: actor },
      });

    this.siwbXActor.start();
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
      this.siwbXActor.send({
        type: "CONNECT",
        providerKey: this.meta.id as WalletProviderKey,
      });
      const identity = await new Promise<DelegationIdentity>(
        (resolve, reject) => {
          this.siwbXActor.on(
            "AUTHENTICATED",
            (event: {
              data: DelegationIdentity | PromiseLike<DelegationIdentity>;
            }) => {
              resolve(event.data);
            }
          );
          this.siwbXActor.on("ERROR", (e) => {
            reject(e.data);
          });
        }
      );
      console.log("hi", identity);

      this.authClient = await AuthClient.create({
        identity,
      });

      return ok(true);
    } catch (e: any) {
      console.error(e);
      return err({
        kind: ConnectError.ConnectFailed,
        message: e.message ?? "Error while connecting",
      });
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

  on(...args: Parameters<typeof this.siwbXActor.on>) {
    return this.siwbXActor.on(...args);
  }

  public get status() {
    return this.siwbXActor.getSnapshot().value;
  }
}

export { SIWBConnector };
