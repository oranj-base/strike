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
  type Meta,
} from "../base-connector";

import plugLogoLight from "../../assets/plugDark.svg";
import plugLogoDark from "../../assets/plugLight.svg";

export type PlugMeta = Omit<Meta, "type"> & {
  canisterId: string;
};

const nnsPartialInterfaceFactory = ({ IDL }: { IDL: any }) => {
  const BlockHeight = IDL.Nat64;
  const Stats = IDL.Record({
    latest_transaction_block_height: BlockHeight,
    seconds_since_last_ledger_sync: IDL.Nat64,
    sub_accounts_count: IDL.Nat64,
    hardware_wallet_accounts_count: IDL.Nat64,
    accounts_count: IDL.Nat64,
    earliest_transaction_block_height: BlockHeight,
    transactions_count: IDL.Nat64,
    block_height_synced_up_to: IDL.Opt(IDL.Nat64),
    latest_transaction_timestamp_nanos: IDL.Nat64,
    earliest_transaction_timestamp_nanos: IDL.Nat64,
  });
  return IDL.Service({
    get_stats: IDL.Func([], [Stats], ["query"]),
  });
};

class Plug extends BaseConnector {
  constructor(config: Partial<Config> = {}) {
    super(config, {
      id: "ic.plug",
      name: "Plug",
      type: ConnectorType.ICP,
      features: [],
      icon: {
        light: plugLogoLight,
        dark: plugLogoDark,
      },
      link: "https://chromewebstore.google.com/detail/plug/cfbfdhimifdmdehjmkdobpcjfefblkjm",
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
      const nnsCanisterId = options?.canisterId ?? "";
      const whitelist = [nnsCanisterId];
      const connected = await window.ic.plug.isConnected();
      if (!connected) await window.ic.plug.requestConnect({ whitelist });
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
      // @ts-ignore
      await window.ic.plug.disconnect();
      await this.authClient.logout(options);
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: DisconnectError.DisconnectFailed });
    }
  }
}

export { Plug };
