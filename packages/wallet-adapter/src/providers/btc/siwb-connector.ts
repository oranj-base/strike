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
  type ConnectOptions,
} from "../base-connector";

export type SIWBMeta = Omit<Meta, "type"> & {
  siwbActor?: ReturnType<typeof createSIWBActor>;
  siwbXActor?: XActor<typeof siwbMachine>;
};

class SIWBConnector extends BaseConnector<
  SIWBMeta & { type: ConnectorType.BTC }
> {
  private siwbXActor?: XActor<typeof siwbMachine>;

  constructor(config: Partial<Config>, meta: SIWBMeta) {
    super(config, {
      ...meta,
      type: ConnectorType.BTC,
    });

    this.on = this.on.bind(this);
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

  private async createSIWBXActor(canisterId: string) {
    try {
      const actor =
        this.meta.siwbActor ??
        createSIWBActor(canisterId, {
          agentOptions: { host: this.config.host },
        });

      this.siwbXActor =
        this.meta.siwbXActor ??
        createActor(siwbMachine, {
          input: { anonymousActor: actor },
        });

      this.siwbXActor.subscribe((s) => console.log(s));

      this.siwbXActor.start();
    } catch (e) {
      console.error(e);
      return { error: { kind: CreateActorError.CreateActorFailed } };
    }
  }

  async connect(options: ConnectOptions) {
    if (!options.siwbCanisterId) {
      return err({
        kind: ConnectError.ConnectFailed,
        message: "siwbCanisterId is required",
      });
    }

    await this.createSIWBXActor(options.siwbCanisterId);

    try {
      this.siwbXActor?.send({
        type: "CONNECT",
        providerKey: this.meta.id as WalletProviderKey,
      });
      const identity = await new Promise<DelegationIdentity>(
        (resolve, reject) => {
          this.siwbXActor?.on(
            "AUTHENTICATED",
            (event: {
              data: DelegationIdentity | PromiseLike<DelegationIdentity>;
            }) => {
              window.localStorage.setItem(
                "lastConnectedWalletId",
                this.meta.id
              );
              resolve(event.data);
            }
          );
          this.siwbXActor?.on("ERROR", (e) => {
            console.error("Error in SIWB XState", e);
            reject(e.data);
          });
        }
      );

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

  on(...args: Parameters<NonNullable<typeof this.siwbXActor>["on"]>) {
    if (!this.siwbXActor) {
      throw new Error("siwbXActor is not initialized");
    }
    return this.siwbXActor.on(...args);
  }

  public get status() {
    return this.siwbXActor?.getSnapshot().value;
  }
}

export { SIWBConnector };
