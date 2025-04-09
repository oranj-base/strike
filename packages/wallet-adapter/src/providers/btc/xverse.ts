import { type Config } from "../base-connector";
import { SIWBConnector, type SIWBMeta } from "./siwb-connector";

export class XverseConnector extends SIWBConnector {
  constructor(
    config: Partial<Config> = {},
    meta: Partial<SIWBMeta> & Pick<SIWBMeta, "siwbCaniserId">
  ) {
    super(config, {
      ...meta,
      id: "XverseProviders.BitcoinProvider",
      name: "Xverse",
      features: ["bitcoin"],
      icon: {
        dark: "/wallet/xverse.svg",
        light: "/wallet/xverse.svg",
      },
      link: "https://chromewebstore.google.com/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg?hl=en",
    });
  }
}
