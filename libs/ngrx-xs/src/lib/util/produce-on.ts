import { ActionCreator, ActionType, on } from '@ngrx/store';
import produce, { Draft } from 'immer';
import { ReducerTypes } from '@ngrx/store/src/reducer_creator';
import { FunctionWithParametersType } from '@ngrx/store/src/models';

export const produceOn = <Type extends string, C extends FunctionWithParametersType<any, object>, State>(
  actionType: ActionCreator<Type, C>,
  callback: (draft: Draft<State>, action: ActionType<ActionCreator<Type, C>>) => State | void
): ReducerTypes<State, ActionCreator[]> => on(
  actionType,
  (state: State, action: ActionType<ActionCreator<Type, C>>): State =>
    produce<State>(state, (draft: Draft<State>) => callback(draft, action) as Draft<State>)
);
