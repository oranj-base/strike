import { HttpAgent } from '@dfinity/agent';
import { type Action } from './Action';
import { AbstractActionComponent } from './Action/action-components';
import type { ActionState } from './ActionsRegistry';

export interface ActionContext {
  originalUrl: string;
  action: Action;
  actionState: ActionState;
  triggeredLinkedAction: AbstractActionComponent;
}

export interface IncomingActionConfig {
  rpcUrl: string;
  adapter: Pick<ActionAdapter, 'connect' | 'signTransaction'>;
}

export interface ActionAdapter {
  agent: HttpAgent;
  connect: (context: ActionContext) => Promise<string | null>;
  signTransaction: (
    tx: string,
    context: ActionContext,
  ) => Promise<{ signature: string } | { error: string }>;
  confirmTransaction: (
    signature: string,
    context: ActionContext,
  ) => Promise<void>;
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
      return null;
    }
  }

  signTransaction(tx: string, context: ActionContext) {
    return this.adapter.signTransaction(tx, context);
  }

  confirmTransaction(_signature: string): Promise<void> {
    return new Promise<void>((res) => {
      res();
    });
  }
}
