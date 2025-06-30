import React, { type PropsWithChildren, useEffect, useState } from "react";
import { useDialog } from "../hooks";
import { useProviders } from "../hooks";
import { useConnect } from "../hooks";
import { ConnectorType, type Meta } from "@oranjbase/icp-wallet-adapter";

type Props = {
  onClose?: () => void;
  dark?: boolean;
};

const ConnectDialog: React.FC<PropsWithChildren<Props>> = (props) => {
  const dialog = useDialog();
  const providers = useProviders();
  const [selectedWallet, setSelectedWallet] = useState<Meta | undefined>(
    undefined
  );

  const [lastConnectedWallet, setLastConnectedWallet] = useState<
    Meta | undefined
  >(undefined);

  const [error, setError] = useState("");
  const [isSelectedWalletNotInstalled, setIsSelectedWalletNotInstalled] =
    useState(false);

  const {
    onClose = () => {
      dialog.close();
      setSelectedWallet(undefined);
      setIsSelectedWalletNotInstalled(false);
      setError("");
    },
    dark,
  } = props;

  const { isConnected, isConnecting, connectAsync } = useConnect();

  useEffect(() => {
    if (isConnected) {
      onClose();
    }
  }, [isConnected]);

  useEffect(() => {
    const lastConnectedWalletId = window.localStorage.getItem(
      "lastConnectedWalletId"
    );
    const provider = providers.find(
      (provider) => provider.meta.id === lastConnectedWalletId
    );
    if (provider) setLastConnectedWallet(provider.meta);
  }, [providers]);

  useEffect(() => {
    if (dialog.isOpen) {
      document.body.style.overflow = "hidden";
    }
    if (!dialog.isOpen) {
      document.body.style.overflow = "unset";
    }
  }, [dialog.isOpen]);

  useEffect(() => {
    const handleEsc = (event: any) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const onClickInside = (e: any) => {
    e.stopPropagation();
  };

  const handleConnect = (meta: Meta) => {
    setSelectedWallet(meta);

    connectAsync({
      provider: meta.id,
    }).catch((err) => {
      if (err.error.message.includes("not found")) {
        setIsSelectedWalletNotInstalled(true);
        setError(err.error.message);
      } else {
        setError(err.error.message);
      }
    });
  };

  const handleBack = () => {
    setError("");
    setIsSelectedWalletNotInstalled(false);
    setSelectedWallet(undefined);
  };

  const handleTryAgain = () => {
    setError("");
    if (!selectedWallet) return;
    connectAsync({
      provider: selectedWallet?.id,
    }).catch((err) => {
      setError(err.error.message);
    });
  };

  return dialog.isOpen ? (
    <>
      <div
        className={`dialog-styles ${dark ? "dark" : "light"}`}
        // onClick={onClose}
      >
        <div onClick={onClickInside} className="dialog-container">
          <div className="dialog-title">
            {selectedWallet
              ? `${selectedWallet.name} Wallet`
              : "Connect Wallet"}
          </div>
          <button className="close-button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="20"
              viewBox="0 0 24 20"
              fill="none"
            >
              <rect
                x="2.80762"
                y="17.7782"
                width="24"
                height="2"
                transform="rotate(-45 2.80762 17.7782)"
                fill="#121212"
              />
              <rect
                x="4.22192"
                y="0.807617"
                width="24"
                height="2"
                transform="rotate(45 4.22192 0.807617)"
                fill="#121212"
              />
            </svg>
          </button>
          {selectedWallet && (
            <button className="back-button" onClick={handleBack}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="#121212"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {/* Wallets */}
          <div className="wallet-container">
            <div className="wallet-container">
              {providers
                .filter((provider) => provider.meta.type === ConnectorType.ICP)
                .map((provider) => {
                  return (
                    <button
                      key={provider.meta.id}
                      onClick={() => handleConnect(provider.meta)}
                      className={`button-styles ${provider.meta.id}-styles`}
                      {...props}
                    >
                      <div className="button-image-container">
                        <img
                          className={"img-styles"}
                          src={
                            dark
                              ? provider.meta.icon.dark
                              : provider.meta.icon.light
                          }
                        />
                        <span className="button-label">
                          {provider.meta.name}
                        </span>
                      </div>
                      <div className="button-image-title">
                        {provider.meta.id === lastConnectedWallet?.id
                          ? "LAST USED"
                          : ""}
                      </div>
                    </button>
                  );
                })}
            </div>
            <div className="wallet-container">
              {providers
                .filter((provider) => provider.meta.type === ConnectorType.BTC)
                .map((provider) => {
                  return (
                    <button
                      key={provider.meta.id}
                      onClick={() => handleConnect(provider.meta)}
                      className={`button-styles ${provider.meta.id}-styles`}
                      {...props}
                    >
                      <div className="button-image-container">
                        <img
                          className={"img-styles"}
                          src={
                            dark
                              ? provider.meta.icon.dark
                              : provider.meta.icon.light
                          }
                        />
                        <span className="button-label">
                          {provider.meta.name}
                        </span>
                      </div>
                      <div className="button-image-title">
                        {provider.meta.id === lastConnectedWallet?.id
                          ? "LAST USED"
                          : ""}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
          {/* Connecting Modal */}
          {selectedWallet && (
            <div className="connecting-container">
              <div className="loading-image-container">
                <img
                  className="loading-img"
                  src={
                    dark ? selectedWallet.icon.dark : selectedWallet.icon.light
                  }
                />
                <span className="loader"></span>
              </div>
              <div className="loading-title">
                Continue in {selectedWallet.name}
              </div>
              <div className="loading-description">
                Accept connection request in the wallet
              </div>
              <div
                style={{
                  height: "24px",
                  color: error
                    ? "#DD524C"
                    : isConnected
                      ? "#55B5A6"
                      : "#424242",
                }}
                className="status-text"
              >
                {isSelectedWalletNotInstalled
                  ? "Wallet not found"
                  : isConnecting
                    ? "Connecting Wallet"
                    : error}
              </div>
              {!isSelectedWalletNotInstalled && (
                <button
                  className="try-button"
                  onClick={handleTryAgain}
                  disabled={isConnecting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M1.66675 8.33333C1.66675 8.33333 3.33757 6.05685 4.69494 4.69854C6.05232 3.34022 7.92808 2.5 10.0001 2.5C14.1422 2.5 17.5001 5.85786 17.5001 10C17.5001 14.1421 14.1422 17.5 10.0001 17.5C6.58084 17.5 3.69601 15.2119 2.79322 12.0833M1.66675 8.33333V3.33333M1.66675 8.33333H6.66675"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Try Again
                </button>
              )}
              {isSelectedWalletNotInstalled && (
                <div className="not-installed">
                  Don’t have Metamask?
                  <a
                    style={{ color: "#3670FF", cursor: "pointer" }}
                    href={selectedWallet.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get It Here
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  ) : null;
};

export default ConnectDialog;
