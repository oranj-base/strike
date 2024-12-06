import { type ActorSubclass, type Agent, type Identity } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import { Principal } from "@dfinity/principal";
import { ok, err } from "neverthrow";

import plugLogoLight from "../assets/plugLight.svg";
import plugLogoDark from "../assets/plugDark.svg";
import {
  BalanceError,
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  TransferError,
  type Config,
  BaseConnector,
  type IWalletConnector,
} from "./connectors";

type Plug = {
  createActor: <T>(args: {
    canisterId: string;
    interfaceFactory: IDL.InterfaceFactory;
  }) => Promise<ActorSubclass<T>>;
  agent: Agent;
  createAgent: (options: {
    host: string;
    whitelist: Array<string>;
  }) => Promise<Agent>;
  getPrincipal: () => Promise<Principal>;
  isConnected: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  requestConnect: (config: Config) => Promise<boolean>;
  accountId: string;
  requestTransfer: (args: {
    to: string;
    amount: number;
    opts?: {
      fee?: number;
      memo?: string;
      from_subaccount?: number;
      created_at_time?: {
        timestamp_nanos: number;
      };
    };
  }) => Promise<{
    height: number;
  }>;
  requestBalance: () => Promise<
    Array<{
      amount: number;
      canisterId: string;
      decimals: number;
      image?: string;
      name: string;
      symbol: string;
    }>
  >;
  getManagementCanister: () => Promise<ActorSubclass | undefined>;
};

class PlugWallet extends BaseConnector implements IWalletConnector {
  #identity?: Identity;
  #client?: any;
  #ic?: Plug;
  #wallet?: {
    principal: string;
    accountId: string;
  };

  get identity() {
    return this.#identity;
  }

  get wallets() {
    return this.#wallet ? [this.#wallet] : [];
  }

  get client() {
    return this.#client;
  }

  get ic() {
    return this.#ic;
  }

  constructor(userConfig = {}) {
    super(
      {
        whitelist: [],
        host: "https://icp0.io",
        dev: true,
        onConnectionUpdate: () => {
          // TODO:
          // const { agent, principal, accountId } =
          //   window.ic.plug.sessionManager.sessionData;
          // TODO: recreate actors
          // TODO: handle account switching
        },
        ...userConfig,
      },
      {
        features: ["wallet"],
        icon: {
          light: plugLogoLight,
          dark: plugLogoDark,
        },
        id: "plug",
        name: "Plug Wallet",
      }
    );
    // @ts-ignore
    this.#ic = window.ic?.plug;
  }

  async init() {
    // TODO: handle account switching
    try {
      if (!this.#ic) {
        return err({ kind: InitError.NotInstalled });
      }
      const status = await this.status();

      if (status === "connected") {
        await this.#ic.createAgent({
          host: this.config.host,
          whitelist: this.config.whitelist,
        });
        // Never finishes if locked
        this.principal = (await this.#ic.getPrincipal()).toString();
        this.#wallet = {
          principal: this.principal,
          accountId: this.#ic.accountId,
        };
      }
      return ok({ isConnected: false });
    } catch (e) {
      console.error(e);
      return err({ kind: InitError.InitFailed });
    }
  }

  async status() {
    if (!this.#ic) {
      return "disconnected";
    }
    try {
      return await Promise.race([
        this.#ic.isConnected().then((c) => {
          return c ? "connected" : "disconnected";
        }),
        new Promise((resolve) => setTimeout(() => resolve("locked"), 1000)),
      ]);
    } catch (e) {
      return "disconnected";
    }
  }

  async isConnected() {
    return (await this.status()) === "connected";
  }

  async createActor<Service>(
    canisterId: string,
    idlFactory: IDL.InterfaceFactory
  ) {
    if (!this.#ic) {
      return err({ kind: CreateActorError.NotInitialized });
    }
    try {
      // Fetch root key for certificate validation during development
      if (this.config.dev) {
        const res = await this.#ic.agent
          .fetchRootKey()
          .then(() => ok(true))
          .catch((e) => err({ kind: CreateActorError.FetchRootKeyFailed }));
        if (res.isErr()) {
          return res;
        }
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
        window.open("https://plugwallet.ooo/", "_blank");
        return err({ kind: ConnectError.NotInstalled });
      }
      await this.#ic.requestConnect(this.config);
      this.principal = (await this.#ic.getPrincipal()).toString();
      if (this.principal) {
        this.#wallet = {
          principal: this.principal,
          accountId: this.#ic.accountId,
        };
        return ok(true);
      }
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
      // TODO: should be awaited but never finishes, tell Plug to fix
      this.#ic.disconnect();
      return ok(true);
    } catch (e) {
      console.error(e);
      return err({ kind: DisconnectError.DisconnectFailed });
    }
  }

  async requestTransfer(opts: {
    amount: number;
    to: string;
    symbol?: string;
    standard?: string;
    decimals?: number;
    fee?: number;
    memo?: bigint;
    createdAtTime?: Date;
    fromSubAccount?: number;
  }) {
    const {
      to,
      amount,
      standard = "ICP",
      symbol = "ICP",
      decimals = 8,
      fee = 0,
      memo = BigInt(0),
      createdAtTime = new Date(),
      fromSubAccount = 0,
    } = opts;
    try {
      const result = await this.#ic?.requestTransfer({
        to,
        amount: amount * 100000000,
      });

      switch (!!result) {
        case true:
          return ok({ height: result!.height });
        default:
          // TODO: ?
          return err({ kind: TransferError.TransferFailed });
      }
    } catch (e) {
      console.error(e);
      return err({ kind: TransferError.TransferFailed });
    }
  }

  async queryBalance() {
    try {
      if (!this.#ic) {
        return err({ kind: BalanceError.NotInitialized });
      }
      const assets = await this.#ic.requestBalance();
      return ok(assets);
    } catch (e) {
      console.error(e);
      return err({ kind: BalanceError.QueryBalanceFailed });
    }
  }

  // TODO:

  // signMessage({ message }) {
  //   return this.#ic?.signMessage({message})
  // }

  // async getManagementCanister() {
  //   return this.#ic?.getManagementCanister()
  // }

  // batchTransactions(...args) {
  //   return this.#ic?.batchTransactions(...args)
  // }
}

export { PlugWallet };
