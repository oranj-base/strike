import type { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { useEffect, useMemo, useReducer, useState } from 'react';
import {
  AbstractActionComponent,
  Action,
  ButtonActionComponent,
  FormActionComponent,
  getActionState,
  isParameterSelectable,
  isPatternAllowed,
  MultiValueActionComponent,
  SingleValueActionComponent,
  type ActionCallbacksConfig,
  type ActionContext,
  type ActionState,
} from '../api/index.ts';
import { useAction, useActionICPWalletAdapter } from '../hooks/index.ts';
import { checkSecurity, type SecurityLevel } from '../shared/index.ts';
import { isPostRequestError } from '../utils/type-guards.ts';
import {
  ActionLayout,
  DisclaimerType,
  type Disclaimer,
  type StylePreset,
} from './ActionLayout.tsx';

type ExecutionStatus = 'blocked' | 'idle' | 'executing' | 'success' | 'error';

interface ExecutionState {
  status: ExecutionStatus;
  executingAction?: AbstractActionComponent | null;
  errorMessage?: string | null;
  successMessage?: string | null;
}

enum ExecutionType {
  INITIATE = 'INITIATE',
  FINISH = 'FINISH',
  FAIL = 'FAIL',
  RESET = 'RESET',
  SOFT_RESET = 'SOFT_RESET',
  UNBLOCK = 'UNBLOCK',
  BLOCK = 'BLOCK',
}

type ActionValue =
  | {
      type: ExecutionType.INITIATE;
      executingAction: AbstractActionComponent;
      errorMessage?: string;
    }
  | {
      type: ExecutionType.FINISH;
      successMessage?: string | null;
    }
  | {
      type: ExecutionType.FAIL;
      errorMessage: string;
    }
  | {
      type: ExecutionType.RESET;
    }
  | {
      type: ExecutionType.UNBLOCK;
    }
  | {
      type: ExecutionType.BLOCK;
    }
  | {
      type: ExecutionType.SOFT_RESET;
      errorMessage?: string;
    };

const executionReducer = (
  state: ExecutionState,
  action: ActionValue,
): ExecutionState => {
  switch (action.type) {
    case ExecutionType.INITIATE:
      return { status: 'executing', executingAction: action.executingAction };
    case ExecutionType.FINISH:
      return {
        ...state,
        status: 'success',
        successMessage: action.successMessage,
        errorMessage: null,
      };
    case ExecutionType.FAIL:
      return {
        ...state,
        status: 'error',
        errorMessage: action.errorMessage,
        successMessage: null,
      };
    case ExecutionType.RESET:
      return {
        status: 'idle',
      };
    case ExecutionType.SOFT_RESET:
      return {
        ...state,
        executingAction: null,
        status: 'idle',
        errorMessage: action.errorMessage,
        successMessage: null,
      };
    case ExecutionType.BLOCK:
      return {
        status: 'blocked',
      };
    case ExecutionType.UNBLOCK:
      return {
        status: 'idle',
      };
  }
};

const buttonVariantMap: Record<
  ExecutionStatus,
  'default' | 'error' | 'success'
> = {
  blocked: 'default',
  idle: 'default',
  executing: 'default',
  success: 'success',
  error: 'error',
};

const buttonLabelMap: Record<ExecutionStatus, string | null> = {
  blocked: null,
  idle: null,
  executing: 'Executing',
  success: 'Completed',
  error: 'Failed',
};

const checkSecurityFromActionState = (
  state: ActionState,
  normalizedSecurityLevel: NormalizedSecurityLevel,
): boolean => {
  // TODO
  return checkSecurity(state, normalizedSecurityLevel.actions);
};

const SOFT_LIMIT_BUTTONS = 10;
const SOFT_LIMIT_INPUTS = 3;
const SOFT_LIMIT_FORM_INPUTS = 10;

const DEFAULT_SECURITY_LEVEL: SecurityLevel = 'only-trusted';

type Source = 'websites' | 'interstitials' | 'actions';
type NormalizedSecurityLevel = Record<Source, SecurityLevel>;

export const ActionContainer = ({
  action: initialAction,
  websiteUrl,
  websiteText,
  callbacks,
  securityLevel = DEFAULT_SECURITY_LEVEL,
  stylePreset = 'default',
  Experimental__ActionLayout = ActionLayout,
}: {
  action: Action;
  websiteUrl?: string | null;
  websiteText?: string | null;
  callbacks?: Partial<ActionCallbacksConfig>;
  securityLevel?: SecurityLevel | NormalizedSecurityLevel;
  stylePreset?: StylePreset;

  // please do not use it yet, better api is coming..
  Experimental__ActionLayout?: typeof ActionLayout;
}) => {
  const { adapter } = useActionICPWalletAdapter({
    agent: initialAction.adapter.agent,
  });

  const [action, setAction] = useState(initialAction);

  const { action: newAction } = useAction({
    url: 'icp-action:' + initialAction.url,
    adapter,
  });

  useEffect(() => {
    if (newAction) setAction(newAction);
  }, [newAction]);

  const normalizedSecurityLevel: NormalizedSecurityLevel = useMemo(() => {
    if (typeof securityLevel === 'string') {
      return {
        websites: securityLevel,
        interstitials: securityLevel,
        actions: securityLevel,
      };
    }

    return securityLevel;
  }, [securityLevel]);

  const [actionState, setActionState] = useState<ActionState | null>(null);
  const overallState = useMemo(() => actionState ?? 'notfound', [actionState]);

  // adding ui check as well, to make sure, that on runtime registry lookups, we are not allowing the action to be executed
  const isPassingSecurityCheck =
    (actionState &&
      checkSecurityFromActionState(actionState, normalizedSecurityLevel)) ??
    true;

  const [executionState, dispatch] = useReducer(executionReducer, {
    status:
      overallState !== 'malicious' && isPassingSecurityCheck
        ? 'idle'
        : 'blocked',
  });

  useEffect(() => {
    (async () => {
      const state = await getActionState(action);
      setActionState(state);
    })();
  }, [action]);

  useEffect(() => {
    if (actionState) {
      callbacks?.onActionMount?.(action, actionState);
    }
  }, [callbacks, action, actionState]);

  const buttons = useMemo(
    () =>
      action?.actions
        .filter((it) => it instanceof ButtonActionComponent)
        .filter((it) =>
          executionState.executingAction
            ? executionState.executingAction === it
            : true,
        )
        .toSpliced(SOFT_LIMIT_BUTTONS) ?? [],
    [action, executionState.executingAction],
  );
  const inputs = useMemo(
    () =>
      action?.actions
        .filter(
          (it) =>
            it instanceof SingleValueActionComponent ||
            it instanceof MultiValueActionComponent,
        )
        .filter((it) =>
          executionState.executingAction
            ? executionState.executingAction === it
            : true,
        )
        .toSpliced(SOFT_LIMIT_INPUTS) ?? [],
    [action, executionState.executingAction],
  );
  const form = useMemo(() => {
    const [formComponent] =
      action?.actions
        .filter((it) => it instanceof FormActionComponent)
        .filter((it) =>
          executionState.executingAction
            ? executionState.executingAction === it
            : true,
        ) ?? [];

    return formComponent;
  }, [action, executionState.executingAction]);

  const execute = async (
    component: AbstractActionComponent,
    params?: Record<string, string | string[]>,
  ) => {
    if (params) {
      if (component instanceof FormActionComponent) {
        Object.entries(params).forEach(([name, value]) =>
          component.setValue(value, name),
        );
      }

      if (component instanceof MultiValueActionComponent) {
        component.setValue(params[component.parameter.name]);
      }

      if (component instanceof SingleValueActionComponent) {
        const incomingValues = params[component.parameter.name];
        const value =
          typeof incomingValues === 'string'
            ? incomingValues
            : incomingValues[0];
        component.setValue(value);
      }
    }
    if (!actionState) {
      return;
    }

    const newActionState = await getActionState(action);
    const newIsPassingSecurityCheck = checkSecurityFromActionState(
      newActionState,
      normalizedSecurityLevel,
    );

    // if action state has changed or origin's state has changed, and it doesn't pass the security check or became malicious, block the action
    if (newActionState !== actionState && !newIsPassingSecurityCheck) {
      setActionState(newActionState);
      dispatch({ type: ExecutionType.BLOCK });
      return;
    }

    dispatch({ type: ExecutionType.INITIATE, executingAction: component });

    const context: ActionContext = {
      action: component.parent,
      actionState: actionState,
      originalUrl: websiteUrl ?? component.parent.url,
      triggeredLinkedAction: component,
    };

    try {
      const identity = await action.adapter.connect(context);

      if (!identity) {
        dispatch({ type: ExecutionType.RESET });
        return;
      }
      const actionData = await component
        .get(identity.getPrincipal().toString())
        .catch((e: Error) => ({ error: e.message }));

      if (isPostRequestError(actionData)) {
        dispatch({
          type: ExecutionType.SOFT_RESET,
          errorMessage: isPostRequestError(actionData)
            ? actionData.error
            : 'Transaction data missing',
        });
        return;
      }
      // construct idlFactory
      const idlFactory: IDL.InterfaceFactory = ({ IDL }) => {
        const parseType = (typeStr: string): IDL.Type => {
          const trimmed = typeStr.trim();

          // Check if it's a Vec type
          const vecMatch = trimmed.match(/^Vec\s+(.+)$/i);
          if (vecMatch) {
            const innerType = parseType(vecMatch[1]);
            return IDL.Vec(innerType);
          }

          // Handle basic types
          const typeLower = trimmed.toLowerCase();
          switch (typeLower) {
            case 'principal':
              return IDL.Principal;
            case 'text':
              return IDL.Text;
            case 'nat':
              return IDL.Nat;
            case 'nat8':
              return IDL.Nat8;
            case 'nat16':
              return IDL.Nat16;
            case 'nat32':
              return IDL.Nat32;
            case 'nat64':
              return IDL.Nat64;
            case 'int':
              return IDL.Int;
            case 'int8':
              return IDL.Int8;
            case 'int16':
              return IDL.Int16;
            case 'int32':
              return IDL.Int32;
            case 'int64':
              return IDL.Int64;
            case 'float32':
              return IDL.Float32;
            case 'float64':
              return IDL.Float64;
            case 'bool':
              return IDL.Bool;
            case 'null':
              return IDL.Null;
            default:
              throw new Error(`Unknown type: ${typeStr}`);
          }
        };

        const input = actionData.input.map((typeStr) => parseType(typeStr));
        const output = actionData.output.map((typeStr) => parseType(typeStr));

        return IDL.Service({
          [actionData.method]: IDL.Func(input, output, [
            actionData.type === 'query' ? 'query' : '',
          ]),
        });
      };
      // Create actor
      const actorResult = await action.adapter.createActor(
        action.canisterId,
        idlFactory,
        context,
      );
      if ('error' in actorResult) {
        dispatch({ type: ExecutionType.RESET });
        return;
      }
      const actor = actorResult.actor;

      const parameters: any[] = [];

      for (let i = 0; i < actionData.inputParameters.length; i++) {
        const parameter = actionData.inputParameters[i];
        const type = actionData.input[i];
        const uiParameter = actionData.uiParameters[i];
        let value = '';

        // If the parameter is a placeholder, replace it with the value from the input
        if (/^\{(.*)\}$/.test(parameter)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          value = params[parameter.slice(1, -1)];
        } else {
          value = parameter;
        }

        // Check if the type indicates an array (e.g., "Vec Text")
        const isArrayType =
          type.toLowerCase().startsWith('vec') || uiParameter?.isArray;

        // Extract the inner type from Vec types
        const innerType = type.toLowerCase().startsWith('vec')
          ? type.replace(/^vec\s*/i, '').trim()
          : type;

        switch (innerType.toLowerCase()) {
          case 'principal':
            if (isArrayType) {
              const principals = Array.isArray(value) ? value : [value];
              parameters.push(
                principals.map((v: string) => Principal.fromText(v)),
              );
            } else {
              parameters.push(Principal.fromText(value));
            }
            break;
          case 'text':
            if (isArrayType) {
              parameters.push(Array.isArray(value) ? value : [value]);
            } else {
              parameters.push(value);
            }
            break;
          default:
            throw new Error(`Unknown type: ${type}`);
        }
      }

      // run action
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const result = await actor[actionData.method](...parameters);

      // TODO: Handle next action

      dispatch({
        type: ExecutionType.FINISH,
        successMessage: JSON.stringify(result),
      });
      return;
    } catch (e) {
      console.error(e);
      dispatch({
        type: ExecutionType.SOFT_RESET,
        errorMessage: (e as Error).message ?? 'Unknown error, please try again',
      });
    }
  };

  const asButtonProps = (it: ButtonActionComponent) => ({
    text: buttonLabelMap[executionState.status] ?? it.label,
    loading:
      executionState.status === 'executing' &&
      it === executionState.executingAction,
    disabled:
      action.disabled ||
      action.type === 'completed' ||
      executionState.status !== 'idle',
    variant:
      buttonVariantMap[
        action.type === 'completed' ? 'success' : executionState.status
      ],
    onClick: (params?: Record<string, string | string[]>) =>
      execute(it.parentComponent ?? it, params),
  });

  const asInputProps = (
    it: SingleValueActionComponent | MultiValueActionComponent,
    { placement }: { placement: 'form' | 'standalone' } = {
      placement: 'standalone',
    },
  ) => {
    return {
      type: it.parameter.type ?? 'text',
      placeholder: it.parameter.label,
      disabled:
        action.disabled ||
        action.type === 'completed' ||
        executionState.status !== 'idle',
      name: it.parameter.name,
      required: it.parameter.required,
      min: it.parameter.min,
      max: it.parameter.max,
      pattern:
        it instanceof SingleValueActionComponent &&
        isPatternAllowed(it.parameter)
          ? it.parameter.pattern
          : undefined,
      options: isParameterSelectable(it.parameter)
        ? it.parameter.options
        : undefined,
      description: it.parameter.patternDescription,
      button:
        placement === 'standalone'
          ? asButtonProps(it.toButtonActionComponent())
          : undefined,
    };
  };

  const asFormProps = (it: FormActionComponent) => {
    return {
      button: asButtonProps(it.toButtonActionComponent()),
      inputs: it.parameters.toSpliced(SOFT_LIMIT_FORM_INPUTS).map((parameter) =>
        asInputProps(it.toInputActionComponent(parameter.name), {
          placement: 'form',
        }),
      ),
    };
  };

  const disclaimer: Disclaimer | null = useMemo(() => {
    if (overallState === 'malicious') {
      return {
        type: DisclaimerType.BLOCKED,
        ignorable: isPassingSecurityCheck,
        hidden: executionState.status !== 'blocked',
        onSkip: () => dispatch({ type: ExecutionType.UNBLOCK }),
      };
    }

    if (overallState === 'notfound') {
      return {
        type: DisclaimerType.UNKNOWN,
        ignorable: isPassingSecurityCheck,
      };
    }

    return null;
  }, [executionState.status, isPassingSecurityCheck, overallState]);

  return (
    <Experimental__ActionLayout
      stylePreset={stylePreset}
      type={overallState}
      title={action.title}
      description={action.description}
      websiteUrl={websiteUrl}
      websiteText={websiteText}
      image={action.icon}
      error={
        executionState.status !== 'success'
          ? (executionState.errorMessage ?? action.error)
          : null
      }
      success={executionState.successMessage}
      buttons={buttons.map(asButtonProps)}
      inputs={inputs.map((input) => asInputProps(input))}
      form={form ? asFormProps(form) : undefined}
      disclaimer={disclaimer}
    />
  );
};
