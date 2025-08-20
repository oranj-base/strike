import { type Config } from "../base-connector";
import { SIWBConnector, type SIWBMeta } from "./siwb-connector";

import unisatLogoLight from "../../assets/unisat.png";
import unisatLogoDark from "../../assets/unisat.png";

export class UnisatConnector extends SIWBConnector {
  constructor(
    config: Partial<Config> = {},
    meta: Partial<SIWBMeta> & Pick<SIWBMeta, "siwbCanisterId">
  ) {
    super(config, {
      ...meta,
      id: "unisat",
      name: "Unisat",
      features: ["bitcoin"],
      icon: {
        dark: unisatLogoDark,
        light: unisatLogoLight,
      },
      link: "https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo?hl=en",
    });
  }
}
