import React, { type CSSProperties, type PropsWithChildren } from "react";
import { useConnect, useDialog } from "../index";

type Props = {
  style?: CSSProperties;
  dark?: boolean;
  isExtension?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
};
const ConnectButton: React.FC<PropsWithChildren<Props>> = ({
  style = {},
  dark = false,
  isExtension = false,
  onConnect = () => {},
  onDisconnect = () => {},
  children,
}) => {
  const dialog = useDialog();
  const { disconnect, isConnected } = useConnect({
    onConnect,
    onDisconnect,
  });

  return isConnected ? (
    <button
      onClick={disconnect}
      style={style}
      className={isExtension ? "connect-button-extension" : "connect-button"}
    >
      {children ?? "Disconnect"}
    </button>
  ) : (
    <button
      onClick={() => dialog.open()}
      style={style}
      className={isExtension ? "connect-button-extension" : "connect-button"}
    >
      {children ?? "Connect"}
    </button>
  );
};

export default ConnectButton;
