import { type Config } from "../base-connector";
import { SIWBConnector } from "./siwb-connector";

import xverseLogoLight from "../../assets/xverse.svg";
import xverseLogoDark from "../../assets/xverse.svg";
export class XverseConnector extends SIWBConnector {
  constructor(config: Partial<Config> = {}) {
    super(config, {
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
