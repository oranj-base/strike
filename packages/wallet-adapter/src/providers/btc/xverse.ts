import { type Config } from "../base-connector";
import { SIWBConnector, type SIWBMeta } from "./siwb-connector";

import xverseLogoLight from "../../assets/xverse.svg";
import xverseLogoDark from "../../assets/xverse.svg";
export class XverseConnector extends SIWBConnector {
  constructor(
    config: Partial<Config> = {},
    meta: Partial<SIWBMeta> & Pick<SIWBMeta, "siwbCanisterId">
  ) {
    super(config, {
      ...meta,
      id: "XverseProviders.BitcoinProvider",
      name: "Xverse",
      features: ["bitcoin"],
      icon: {
        dark: xverseLogoDark,
        light: xverseLogoLight,
      },
      link: "https://chromewebstore.google.com/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg?hl=en",
    });
  }
}
