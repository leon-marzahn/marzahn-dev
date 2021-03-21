import {
  produceOn,
  XsEmptyAction,
  XsPropsAction,
  XsReducer,
  XsStore,
  XsStoreActions,
  XsStoreEffects,
  XsStoreSelectors
} from '@marzahn-dev/ngrx-xs';
import { Action, createAction, createSelector, MemoizedSelector, props } from '@ngrx/store';
import { createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Injector } from '@angular/core';

export interface CounterXsStoreState {
  counter: number;
}

export interface CounterXsStoreActions extends XsStoreActions {
  increaseCounter: XsEmptyAction;
  decreaseCounter: XsEmptyAction;
  setCounter: XsPropsAction<{ value: number }>;
}

export interface CounterXsStoreSelectors extends XsStoreSelectors<CounterXsStoreState> {
  selectCounter: MemoizedSelector<CounterXsStore, number>;
}

export class CounterXsStore extends XsStore<CounterXsStoreState, CounterXsStoreActions, CounterXsStoreEffects, CounterXsStoreSelectors> {
  protected getInitialState(): CounterXsStoreState {
    return {
      ...super.getInitialState(),
      counter: 0
    };
  }

  protected createActions(label: string): CounterXsStoreActions {
    return {
      ...super.createActions(label),

      increaseCounter: createAction(XsStore.getActionType(label, 'INCREASE_COUNTER')),
      decreaseCounter: createAction(XsStore.getActionType(label, 'DECREASE_COUNTER')),
      setCounter: createAction(XsStore.getActionType(label, 'SET_COUNTER'), props<{ value: number }>())
    };
  }

  protected createReducerArray(initialState: CounterXsStoreState): XsReducer<CounterXsStoreState>[] {
    return [
      ...super.createReducerArray(initialState),

      produceOn(this.actions.increaseCounter, draft => {
        draft.counter++;
      }),
      produceOn(this.actions.decreaseCounter, draft => {
        draft.counter--;
      }),
      produceOn(this.actions.setCounter, (draft, { value }) => {
        draft.counter = value;
      })
    ];
  }

  protected createEffects(injector: Injector): CounterXsStoreEffects {
    return new CounterXsStoreEffects(injector, this.actions);
  }

  protected createSelectors(stateSelector: MemoizedSelector<any, CounterXsStoreState>): CounterXsStoreSelectors {
    return {
      ...super.createSelectors(stateSelector),

      selectCounter: createSelector(stateSelector, state => state.counter)
    };
  }
}

export class CounterXsStoreEffects extends XsStoreEffects<CounterXsStoreState, CounterXsStoreActions> {
  public increaseCounter$: any;
  public decreaseCounter$: any;
  public setCounter$: any;

  protected createEffects(): void {
    super.createEffects();

    this.increaseCounter$ = createEffect(() => this.actions$.pipe(
      ofType(this.actions.increaseCounter),
      tap(action => this.actionCallback(action))
    ), { dispatch: false });

    this.decreaseCounter$ = createEffect(() => this.actions$.pipe(
      ofType(this.actions.decreaseCounter),
      tap(action => this.actionCallback(action))
    ), { dispatch: false });

    this.setCounter$ = createEffect(() => this.actions$.pipe(
      ofType(this.actions.setCounter),
      tap(action => this.actionCallback(action))
    ), { dispatch: false });
  }

  protected actionCallback(action: Action, isError: boolean = false): void {
    super.actionCallback(action, isError);

    this.onAction(this.actions.increaseCounter, action, () => console.log('Increased counter.'));
    this.onAction(this.actions.decreaseCounter, action, () => console.log('Decreased counter.'));
    this.onAction(this.actions.setCounter, action, ({ value }) => console.log(`Set counter to ${value}.`));
  }
}
