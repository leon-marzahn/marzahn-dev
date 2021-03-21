import { ActionCreator } from '@ngrx/store/src/models';
import { ReducerTypes } from '@ngrx/store/src/reducer_creator';

export type XsReducer<S> = ReducerTypes<S, ActionCreator[]>;
