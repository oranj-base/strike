import type {
  ActionPostRequest,
  GeneralParameterType,
  TypedActionParameter,
} from '../../actions-spec.ts';
import { Action } from '../Action.ts';
import { AbstractActionComponent } from './AbstractActionComponent.ts';
import { ButtonActionComponent } from './ButtonActionComponent.ts';

export class SingleValueActionComponent extends AbstractActionComponent {
  private parameterValue: string | string[] | null = null;

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

  protected buildBody(principal: string): ActionPostRequest<any> {
    if (this._href.indexOf(`{${this.parameter.name}}`) > -1) {
      return { principal };
    }

    // Ensure we don't send null values
    const value = this.parameterValue ?? '';

    return {
      principal,
      data: {
        [this.parameter.name]: value,
      },
    };
  }

  public get parameter(): TypedActionParameter<GeneralParameterType> {
    const [param] = this.parameters;

    return param as TypedActionParameter<GeneralParameterType>;
  }

  public setValue(value: string | string[]) {
    this.parameterValue = value;
  }

  get href(): string {
    const encodedValue = Array.isArray(this.parameterValue)
      ? this.parameterValue.map((v) => encodeURIComponent(v.trim())).join(',')
      : encodeURIComponent(this.parameterValue?.toString().trim() ?? '');

    return this._href.replace(`{${this.parameter.name}}`, encodedValue);
  }

  toButtonActionComponent(): ButtonActionComponent {
    return new ButtonActionComponent(
      this._parent,
      this._label,
      this._href,
      this._actionIndex,
      undefined,
      this,
    );
  }
}
