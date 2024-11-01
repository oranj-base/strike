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
  const { isConnected, principal, connectAsync, activeProvider } = useConnect();
  const { open } = useDialog();

  const adapter = useMemo(() => {
    return new ActionConfig(agent, {
      connect: async () => {
        if (isConnected) {
          return principal!;
        }

        try {
          const { activeProvider } = await connectAsync();
          return activeProvider.principal ?? null;
        } catch (error) {
          console.log(error);
          open();
          return null;
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
  }, [agent, isConnected, principal, open, connectAsync, activeProvider]);

  return { adapter };
}
