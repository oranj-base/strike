import { Actor, HttpAgent } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import { useConnect, useDialog } from '@oranjbase/icp-wallet-adapter-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { ActionConfig } from '../../api';

/**
 * Hook to create an action adapter using ICP's wallet adapter.
 *
 * Be sure to call `action.setAdapter` with the to update the adapter, every time the instance updates.
 *
 * @param rpcUrlOrConnection
 * @see {Action}
 */
export function useActionICPWalletAdapter({ agent }: { agent: HttpAgent }) {
  const { isConnected, activeProvider, connectAsync, identity } = useConnect();
  const { open, isOpen } = useDialog();

  const isOpenRef = useRef(isOpen);
  const identityRef = useRef(identity);

  // Keep the ref in sync with the actual state
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    identityRef.current = identity;
  }, [identity]);

  const checkStatus = useCallback(async () => {
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!isOpenRef.current) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
    return isOpenRef.current;
  }, []);

  const adapter = useMemo(() => {
    return new ActionConfig(agent, {
      connect: async ({ derivationOrigin }) => {
        if (isConnected) {
          return identity;
        }

        try {
          if (derivationOrigin) {
            const { activeProvider } = await connectAsync({ derivationOrigin });
            return activeProvider.identity;
          } else {
            open();
            await checkStatus();
            return identityRef.current;
          }
        } catch (error) {
          console.log(error);
          return undefined;
        }
      },
      createActor: async (
        canisterId: string,
        idlFactory: IDL.InterfaceFactory,
      ): Promise<{ actor: Actor } | { error: string }> => {
        try {
          const actorResult = await activeProvider?.createActor(
            canisterId,
            idlFactory,
          );
          if (!actorResult) {
            throw new Error('Actor not found');
          }
          if (actorResult.isErr()) {
            throw new Error('Unable to create actor');
          }
          const actor = actorResult.value;
          return { actor };
        } catch (err) {
          return { error: (err as Error).message || 'Signing failed.' };
        }
      },
    });
  }, [
    agent,
    isConnected,
    identity,
    connectAsync,
    open,
    checkStatus,
    activeProvider,
  ]);

  return { adapter };
}
