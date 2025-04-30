import React, {
  useEffect,
  type CSSProperties,
  type PropsWithChildren,
} from "react";
import { useConnect, useDialog } from "../index";

type Props = {
  style?: CSSProperties;
  dark?: boolean;
  isDisconected?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
};
const ConnectButton: React.FC<PropsWithChildren<Props>> = ({
  style = {},
  dark = false,
  isDisconected,
  onConnect = () => {},
  onDisconnect = () => {},
  children,
}) => {
  const dialog = useDialog();
  const { disconnect, isConnected } = useConnect({
    onConnect,
    onDisconnect,
  });

  useEffect(() => {
    console.log("isDisconected", isDisconected);
    if (isDisconected) disconnect();
  }, [isDisconected, disconnect]);

  return isDisconected === undefined ? (
    <>
      {isConnected ? (
        <button onClick={disconnect} style={style} className="connect-button">
          {children ?? "Disconnect"}
        </button>
      ) : (
        <button
          onClick={() => dialog.open()}
          style={style}
          className="connect-button"
        >
          {children ?? "Connect"}
        </button>
      )}
    </>
  ) : null;
};

export default ConnectButton;
