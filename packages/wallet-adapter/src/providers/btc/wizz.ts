import { type Config } from "../base-connector";
import { SIWBConnector, type SIWBMeta } from "./siwb-connector";

export class WizzConnector extends SIWBConnector {
  constructor(
    config: Partial<Config> = {},
    meta: Partial<SIWBMeta> & Pick<SIWBMeta, "siwbCaniserId">
  ) {
    super(config, {
      ...meta,
      id: "wizz",
      name: "Wizz",
      features: ["bitcoin"],
      icon: {
        dark: "/wallet/wizz-black.png",
        light: "/wallet/wizz-black.png",
      },
      link: "https://chromewebstore.google.com/detail/wizz-wallet/ghlmndacnhlaekppcllcpcjjjomjkjpg?hl=en",
    });
  }
}
