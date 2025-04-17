import { Actor, HttpAgent, type Identity } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import { type Action } from './Action';
import { AbstractActionComponent } from './Action/action-components';
import type { ActionState } from './ActionsRegistry';

export interface ActionContext {
  derivationOrigin?: string;
  originalUrl: string;
  action: Action;
  actionState: ActionState;
  triggeredLinkedAction: AbstractActionComponent;
}

export interface IncomingActionConfig {
  rpcUrl: string;
  adapter: Pick<ActionAdapter, 'connect' | 'createActor'>;
}

export interface ActionAdapter {
  agent: HttpAgent;
  connect: (context: ActionContext) => Promise<Identity | undefined>;
  createActor: (
    canisterId: string,
    idlFactory: IDL.InterfaceFactory,
    context: ActionContext,
  ) => Promise<{ actor: Actor } | { error: string }>;
  isSupported?: (
    context: Omit<ActionContext, 'triggeredLinkedAction'>,
  ) => Promise<boolean>;
}

export class ActionConfig implements ActionAdapter {
  private static readonly CONFIRM_TIMEOUT_MS = 60000 * 1.2; // 20% extra time
  public agent: HttpAgent;

  constructor(
    hostOrAgent: string | HttpAgent,
    private adapter: IncomingActionConfig['adapter'],
  ) {
    if (!hostOrAgent) {
      throw new Error('rpcUrl or Agent is required');
    }

    this.agent =
      typeof hostOrAgent === 'string'
        ? new HttpAgent({ host: hostOrAgent })
        : hostOrAgent;
  }

  async connect(context: ActionContext) {
    try {
      return await this.adapter.connect(context);
    } catch {
      return undefined;
    }
  }

  createActor(
    canisterId: string,
    idlFactory: IDL.InterfaceFactory,
    context: ActionContext,
  ): Promise<{ actor: Actor } | { error: string }> {
    return this.adapter.createActor(canisterId, idlFactory, context);
  }

  confirmTransaction(_signature: string): Promise<void> {
    return new Promise<void>((res) => {
      res();
    });
  }
}
