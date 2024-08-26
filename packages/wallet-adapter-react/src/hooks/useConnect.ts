import React, { useContext, useEffect } from "react";
import { useSelector } from "@xstate/react";

import { Connect2ICContext } from "../context";

type Props = {
  onConnect?: (params: { provider: string }) => void;
  onDisconnect?: () => void;
};

export const useConnect = (props: Props = {}) => {
  // TODO: handle
  const { onConnect = () => {}, onDisconnect = () => {} } = props;
  const { client } = useContext(Connect2ICContext);
  const { principal, activeProvider, status } = useSelector(
    client._service,
    (state) => ({
      principal: state.context.activeProvider?.principal,
      activeProvider: state.context.activeProvider,
      status: state.value,
    })
  );

  useEffect(() => {
    const unsub = client.on("connect", onConnect);
    const unsub2 = client.on("disconnect", onDisconnect);
    return () => {
      unsub();
      unsub2();
    };
  }, [client]);

  return {
    principal,
    activeProvider,
    status,
    isInitializing: client._service.getSnapshot().value === "initializing",
    isConnected: client._service.getSnapshot().value === "connected",
    isConnecting: client._service.getSnapshot().value === "connecting",
    isDisconnecting: client._service.getSnapshot().value === "disconnecting",
    isIdle: client._service.getSnapshot().value === "idle",
    connect: (provider?: string) => client.connect(provider),
    connectAsync: async (provider?: string) => client.connectAsync(provider),
    cancelConnect: () => {
      client.cancelConnect();
    },
    disconnect: () => {
      client.disconnect();
    },
  } as const;
};
