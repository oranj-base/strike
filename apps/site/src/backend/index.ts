import {
  Actor,
  ActorConfig,
  ActorSubclass,
  Agent,
  HttpAgent,
  HttpAgentOptions,
} from '@dfinity/agent';

// Imports and re-exports candid interface
import { _SERVICE, idlFactory } from './strike_backend.did.js';
import { Principal } from '@dfinity/principal';
import { asRegistry, asStrikeSearch, Registry } from './types';
export { idlFactory } from './strike_backend.did.js';

/* CANISTER_ID is replaced by webpack based on node environment
 * Note: canister environment variable will be standardized as
 * process.env.CANISTER_ID_<CANISTER_NAME_UPPERCASE>
 * beginning in dfx 0.15.0
 */
export const canisterId = process.env.NEXT_PUBLIC_CANISTER_ID_STRIKE_BACKEND;

export declare interface CreateActorOptions {
  /**
   * @see {@link Agent}
   */
  agent?: Agent;
  /**
   * @see {@link HttpAgentOptions}
   */
  agentOptions?: HttpAgentOptions;
  /**
   * @see {@link ActorConfig}
   */
  actorOptions?: ActorConfig;
}

export const createRawActor = (
  canisterId: string | Principal,
  options: CreateActorOptions = {},
): ActorSubclass<_SERVICE> => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      'Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.',
    );
  }

  // Fetch root key for certificate validation during development
  if (process.env.NEXT_PUBLIC_DFX_NETWORK !== 'ic') {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        'Unable to fetch root key. Check to ensure that your local replica is running',
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

export const createActor = (canisterId, options = {}) => {
  const actor = createRawActor(canisterId, options);
  return {
    ...actor,
    add_registry: async (args: Registry) => {
      const result = await actor.add_registry(
        typeof args.canisterId === 'string'
          ? Principal.fromText(args.canisterId)
          : args.canisterId,
        args.name,
        args.email,
        [args.telegram],
        [args.twitter],
        args.projectName,
        args.description,
        [args.strikeCardLink],
      );
      if ('Ok' in result) {
        return { success: true };
      } else {
        return { success: false };
      }
    },
    get_strike_by_canister_id: async (args: {
      canisterId: Principal | string;
    }) => {
      const result = await actor.get_strike_by_canister_id(
        typeof args.canisterId === 'string'
          ? Principal.fromText(args.canisterId)
          : args.canisterId,
      );

      if (result.length > 0 && result[0] !== undefined) {
        return { success: true, data: asStrikeSearch(result[0]) };
      } else if (result.length === 0) {
        return { success: false, error: 'Canister not found' };
      } else {
        return { success: false, error: 'Something went wrong' };
      }
    },
    get_registry_by_status: async (args: {
      status: 'Submitted' | 'Trusted' | 'Blocked' | 'All';
    }) => {
      // Map string status to StrikeStatus tuple or empty array
      const statusObj: [] | [any] =
        args.status === 'All'
          ? []
          : args.status === 'Blocked'
            ? [{ Blocked: null }]
            : args.status === 'Submitted'
              ? [{ Submitted: null }]
              : [{ Trusted: null }];

      const result = await actor.get_registry_by_status(statusObj);
      if (Array.isArray(result) && result.length > 0) {
        return result.map((item) => asRegistry(item));
      } else {
        return undefined;
      }
    },
  };
};
