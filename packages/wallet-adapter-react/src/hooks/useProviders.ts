import { useContext } from "react";
import { useSelector } from "@xstate/react";
import type { Provider } from "@oranjbase/icp-wallet-adapter";

import { Connect2ICContext } from "../context";

export const useProviders = (): Array<Provider> => {
  const { client } = useContext(Connect2ICContext);
  const providers = useSelector(
    client.service,
    (state) => state.context.providers
  );

  return providers ?? ([] as const);
};
