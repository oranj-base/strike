import { useContext } from "react";
import { Connect2ICContext } from "../context";
import { Client } from "@oranjbase/icp-wallet-adapter";

export const useClient = () => {
  return useContext(Connect2ICContext);
};
