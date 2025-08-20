import { type Config } from "../base-connector";
import { SIWBConnector, type SIWBMeta } from "./siwb-connector";

import orangeLogoLight from "../../assets/orange.png";
import orangeLogoDark from "../../assets/orange.png";

export class OrangeConnector extends SIWBConnector {
  constructor(
    config: Partial<Config> = {},
    meta: Partial<SIWBMeta> & Pick<SIWBMeta, "siwbCanisterId">
  ) {
    super(config, {
      ...meta,
      id: "OrangecryptoProviders.BitcoinProvider",
      name: "Orange",
      features: ["bitcoin"],
      icon: {
        dark: orangeLogoDark,
        light: orangeLogoLight,
      },
      link: "https://chromewebstore.google.com/detail/glmhbknppefdmpemdmjnjlinpbclokhn",
    });
  }
}
