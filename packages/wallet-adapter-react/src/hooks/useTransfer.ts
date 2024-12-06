import { useState } from "react";
import {
  type BaseConnector,
  type IWalletConnector,
  TransferError,
} from "@oranjlabs/icp-wallet-adapter";
import { err } from "neverthrow";

import { useConnect } from "./useConnect";
import { useWallet } from "./useWallet";

type Props = {
  amount: number;
  to: string;
  from?: string;
};

export const useTransfer = ({ amount, to }: Props) => {
  // TODO: check if supported or not
  const [wallet] = useWallet();
  const { activeProvider } = useConnect();
  const [loading, setLoading] = useState<boolean>(false);
  const [_payload, setPayload] = useState<{
    height: number;
    transactionId?: string;
  }>();
  const [error, setError] = useState<{ kind: TransferError }>();

  const transfer = async () => {
    if (!wallet || !activeProvider) {
      return err({ kind: TransferError.NotConnected });
    }
    setLoading(true);
    const result = await (
      activeProvider as BaseConnector & IWalletConnector
    ).requestTransfer({
      amount,
      to,
    });
    result.match(
      (payload) => {
        // TODO: ?
        setPayload(payload);
      },
      (error) => {
        setError(error);
      }
    );
    setLoading(false);
    return result;
  };

  return [transfer, { loading, error }] as const;
};
