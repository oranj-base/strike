import { type Config } from "../base-connector";
import { SIWBConnector, type SIWBMeta } from "./siwb-connector";

export class OKXConnector extends SIWBConnector {
  constructor(
    config: Partial<Config> = {},
    meta: Partial<SIWBMeta> & Pick<SIWBMeta, "siwbCanisterId">
  ) {
    super(config, {
      ...meta,
      id: "okxwallet.bitcoin",
      name: "OKX",
      features: ["bitcoin"],
      icon: {
        dark: "/wallet/okx.png",
        light: "/wallet/okx.png",
      },
      link: "https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge?hl=en",
    });
  }
}
