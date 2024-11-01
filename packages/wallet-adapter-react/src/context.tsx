import React, { createContext, useState, type PropsWithChildren } from "react";
import type { Client } from "@oranjlabs/icp-wallet-adapter";

import "./style.css";
import { ConnectDialog } from "./components";

const Connect2ICContext = createContext<{
  client: Client;
  dialog: {
    open: () => void;
    close: () => void;
    isOpen: boolean;
  };
}>({} as any);

type Props = {
  client: Client;
};

const Connect2ICProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  client,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const dialog = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    isOpen: open,
  };

  return (
    <Connect2ICContext.Provider
      value={{
        client,
        dialog,
      }}
    >
      {children}
      <ConnectDialog />
    </Connect2ICContext.Provider>
  );
};

export { Connect2ICProvider, Connect2ICContext };
