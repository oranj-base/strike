import { useContext } from "react";
import { Connect2ICContext } from "../context";

export const useClient = () => {
  return useContext(Connect2ICContext);
};
