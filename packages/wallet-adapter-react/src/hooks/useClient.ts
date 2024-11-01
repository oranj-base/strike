import { useContext } from "react";
import { Connect2ICContext } from "../context";
import { Client } from "@oranjlabs/icp-wallet-adapter";

export const useClient = (): Client => {
  const { client } = useContext(Connect2ICContext);
  return client;
};
