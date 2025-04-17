import { createActor, Actor } from "xstate";
import { HttpAgent } from "@dfinity/agent";
import EventEmitter from "events";
import { defaultProviders, type BaseConnector, type Config } from "./providers";
import { createAuthMachine, type ConncetedEvent } from "./auth-machine";

type Provider = BaseConnector;

type ClientOptions = {
  providers: Array<Provider> | ((config: Config) => Array<Provider>);
  globalProviderConfig?: {
    whitelist?: Array<string>;
    host?: string;
    dev?: boolean;
    autoConnect?: boolean;
    ledgerCanisterId?: string;
    ledgerHost?: string;
    appName?: string;
    customDomain?: string;
  };
};

class Client {
  public service: Actor<ReturnType<typeof createAuthMachine>>;
  public config;

  constructor(
    service: Actor<ReturnType<typeof createAuthMachine>>,
    config: Config
  ) {
    this.service = service;
    this.config = config;
  }

  connect(provider?: string) {
    this.service.send({ type: "CONNECT", data: { provider } });
  }

  async connectAsync(
    props: { provider?: string; derivationOrigin?: string } | undefined
  ) {
    const { provider, derivationOrigin } = props || {};
    this.service.send({
      type: "CONNECT",
      data: { provider, derivationOrigin },
    });

    return new Promise<ConncetedEvent["data"]>((resolve, reject) => {
      this.service.on("CONNECTED", (event) => {
        resolve(event.data);
      });
      this.service.on("ERROR", (event) => {
        reject(event.data);
      });
    });
  }

  cancelConnect() {
    this.service.send({ type: "CANCEL_CONNECT" });
  }

  public disconnect() {
    this.service.send({ type: "DISCONNECT" });
  }

  public async agent() {
    const identity = this.activeProvider?.identity;
    return new HttpAgent({
      host: this.config.host,
      identity: identity,
    });
  }

  public get providers() {
    return this.service.getSnapshot().context.providers;
  }

  public get activeProvider() {
    return this.service.getSnapshot().context.activeProvider;
  }

  public get principal() {
    return this.service.getSnapshot().context.principal;
  }

  public get status() {
    return this.service.getSnapshot().value;
  }
}

const createClient = ({
  providers: p = defaultProviders(),
  globalProviderConfig = {},
}: Partial<ClientOptions>) => {
  const config: Config = {
    autoConnect: true,
    host: "https://icp0.io",
    ...globalProviderConfig,
    whitelist: globalProviderConfig.whitelist ?? [],
  };
  const providers = typeof p === "function" ? p(config) : p;

  providers.forEach((p) => (p.config = config));

  const actor = createActor(createAuthMachine({ ...config, providers }));

  actor.start();

  return new Client(actor, config);
};

export { createClient, Client };
