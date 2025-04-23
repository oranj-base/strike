import { type Config } from "../base-connector";
import { SIWBConnector } from "./siwb-connector";

import okxLogoLight from "../../assets/okx.png";
import okxLogoDark from "../../assets/okx.png";

export class OKXConnector extends SIWBConnector {
  constructor(config: Partial<Config> = {}) {
    super(config, {
      id: "okxwallet.bitcoin",
      name: "OKX",
      features: ["bitcoin"],
      icon: {
        dark: okxLogoDark,
        light: okxLogoLight,
      },
      link: "https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge?hl=en",
    });
  }
}
