import { Actor, HttpAgent } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import { useConnect, useDialog } from '@oranjlabs/icp-wallet-adapter-react';
import { useMemo } from 'react';

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
  const { isConnected, connectAsync, activeProvider, identity } = useConnect();
  const { open } = useDialog();

  const adapter = useMemo(() => {
    return new ActionConfig(agent, {
      connect: async ({ derivationOrigin }) => {
        if (isConnected) {
          return identity;
        }

        try {
          const { activeProvider } = await connectAsync({ derivationOrigin });
          return activeProvider.identity;
        } catch (error) {
          console.log(error);
          open();
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
  }, [agent, isConnected, identity, open, connectAsync, activeProvider]);

  return { adapter };
}
