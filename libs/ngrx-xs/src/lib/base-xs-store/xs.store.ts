import { Action, ActionReducer, createAction, createReducer, createSelector, MemoizedSelector, props } from '@ngrx/store';
import { XsStoreActions } from './xs-store.actions';
import { XsReducer } from '../util';
import { InjectionToken, Injector } from '@angular/core';
import { XsStoreEffects } from './xs-store.effects';
import { XsStoreErrorPayload } from './xs-store.payloads';
import { XsStoreSelectors } from './xs-store.selectors';
import { USER_PROVIDED_EFFECTS } from '@ngrx/effects';
import uniqWith from 'lodash-es/uniqWith';
import isEqual from 'lodash-es/isEqual';

export interface XsStoreOptions<StateType> {
  actionLabel: string;
  stateSelector: MemoizedSelector<any, StateType>;
  initialState?: StateType;
}

export class XsStore<StateType,
  ActionsType extends XsStoreActions = XsStoreActions,
  EffectsType extends XsStoreEffects<StateType> = XsStoreEffects<StateType>,
  SelectorsType extends XsStoreSelectors<StateType> = XsStoreSelectors<StateType>> {
  public actions: ActionsType;
  public effectsToken: InjectionToken<EffectsType>;
  public selectors: SelectorsType;

  protected reducer: ActionReducer<StateType, Action>;

  constructor(
    protected options: XsStoreOptions<StateType>
  ) {
    this.actions = this.createActions(options.actionLabel) as ActionsType;
    this.reducer = this.createReducer(options.initialState ?? this.getInitialState());
    this.effectsToken = new InjectionToken<EffectsType>(`${this.options.actionLabel}: Effects`);
    this.selectors = this.createSelectors(options.stateSelector) as SelectorsType;
  }

  public static getActionType(label: string, type: string): string {
    return `[${label}]: ${type}`;
  }

  protected getInitialState(): StateType {
    return {} as StateType;
  }

  protected createActions(label: string): ActionsType {
    return {
      error: createAction(XsStore.getActionType(label, 'ERROR'), props<XsStoreErrorPayload>())
    } as ActionsType;
  }

  protected createReducer(initialState: StateType): ActionReducer<StateType, Action> {
    return createReducer(
      initialState,
      ...uniqWith(this.createReducerArray(initialState).reverse(), (a, b) => isEqual(a.types, b.types)).reverse()
    );
  }

  protected createReducerArray(initialState: StateType): XsReducer<StateType>[] {
    return [];
  }

  protected createEffects(injector: Injector): EffectsType {
    return new XsStoreEffects(injector, this.actions) as unknown as EffectsType;
  }

  protected createSelectors(stateSelector: MemoizedSelector<any, StateType>): SelectorsType {
    return {
      selectState: createSelector(stateSelector, state => state)
    } as SelectorsType;
  }

  public getReducer(): ActionReducer<StateType, Action> {
    return this.reducer;
  }

  public getEffectsProviders(): any[] {
    return [
      {
        provide: this.effectsToken,
        useFactory: (injector: Injector) => this.createEffects(injector),
        deps: [Injector]
      },
      {
        provide: USER_PROVIDED_EFFECTS,
        multi: true,
        useValue: [this.effectsToken]
      }
    ];
  }
}
