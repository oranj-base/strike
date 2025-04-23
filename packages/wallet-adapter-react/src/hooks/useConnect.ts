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
  const { principal, identity, activeProvider, status } = useSelector(
    client.service,
    (state) => ({
      principal: state.context.activeProvider?.principal,
      identity: state.context.activeProvider?.identity,
      activeProvider: state.context.activeProvider,
      status: state.value,
    })
  );
  // TODO:
  // useEffect(() => {
  //   const unsub = client.on("connect", onConnect);
  //   const unsub2 = client.on("disconnect", onDisconnect);
  //   return () => {
  //     unsub();
  //     unsub2();
  //   };
  // }, [client]);

  return {
    principal,
    identity,
    activeProvider,
    status,
    isInitializing: client.service.getSnapshot().value === "initializing",
    isConnected: client.service.getSnapshot().value === "connected",
    isConnecting: client.service.getSnapshot().value === "connecting",
    isDisconnecting: client.service.getSnapshot().value === "disconnecting",
    isIdle: client.service.getSnapshot().value === "idle",
    connect: (provider?: string) => client.connect(provider),
    connectAsync: async (
      props:
        | {
            provider?: string;
            derivationOrigin?: string;
            canisterId?: string;
            siwbCanisterId?: string;
          }
        | undefined
    ) => client.connectAsync(props),
    cancelConnect: () => {
      client.cancelConnect();
    },
    disconnect: () => {
      client.disconnect();
    },
  } as const;
};
