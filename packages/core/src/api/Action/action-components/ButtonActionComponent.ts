import type {
  ActionPostRequest,
  TypedActionParameter,
} from '../../actions-spec.ts';
import { Action } from '../Action.ts';
import { AbstractActionComponent } from './AbstractActionComponent.ts';

export class ButtonActionComponent extends AbstractActionComponent {
  constructor(
    protected _parent: Action,
    protected _label: string,
    protected _href: string,
    protected _actionIndex: number,
    protected _parameters?: TypedActionParameter[],
    protected _parentComponent?: AbstractActionComponent,
  ) {
    super(_parent, _label, _href, _actionIndex, _parameters);
  }

  get parentComponent() {
    return this._parentComponent ?? null;
  }

  protected buildBody(principal: string): ActionPostRequest {
    return { principal };
  }

  get href(): string {
    return this._href;
  }
}
