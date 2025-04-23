import React, {
  createContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { Client } from "@oranjlabs/icp-wallet-adapter";

import "./style.css";
import { ConnectDialog, ConnectDialogWithAction } from "./components";
import type { Action } from "@oranjlabs/strike";

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

  const dialog = useMemo(
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      isOpen: open,
    }),
    [open]
  );

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

type PropsWithAction = {
  client: Client;
  action: Action;
};

const Connect2ICProviderWithAction: React.FC<
  PropsWithChildren<PropsWithAction>
> = ({ children, client, action }) => {
  const [open, setOpen] = useState<boolean>(false);

  const dialog = useMemo(
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      isOpen: open,
    }),
    [open]
  );

  return (
    <Connect2ICContext.Provider
      value={{
        client,
        dialog,
      }}
    >
      {children}
      <ConnectDialogWithAction action={action} />
    </Connect2ICContext.Provider>
  );
};

export { Connect2ICProvider, Connect2ICContext, Connect2ICProviderWithAction };
