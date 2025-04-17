import { type Config } from "../base-connector";
import { SIWBConnector, type SIWBMeta } from "./siwb-connector";

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
        dark: "/wallet/unisat.png",
        light: "/wallet/unisat.png",
      },
      link: "https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo?hl=en",
    });
  }
}
