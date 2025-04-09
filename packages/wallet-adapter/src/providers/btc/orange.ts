import { type Config } from "../base-connector";
import { SIWBConnector, type SIWBMeta } from "./siwb-connector";

export class OrangeConnector extends SIWBConnector {
  constructor(
    config: Partial<Config> = {},
    meta: Partial<SIWBMeta> & Pick<SIWBMeta, "siwbCaniserId">
  ) {
    super(config, {
      ...meta,
      id: "OrangecryptoProviders.BitcoinProvider",
      name: "Orange",
      features: ["bitcoin"],
      icon: {
        dark: "/wallet/orange.png",
        light: "/wallet/orange.png",
      },
      link: "https://chromewebstore.google.com/detail/glmhbknppefdmpemdmjnjlinpbclokhn",
    });
  }
}
