import { ActionCreator } from '@ngrx/store';
import { FunctionWithParametersType, TypedAction } from '@ngrx/store/src/models';

export type XsEmptyAction = ActionCreator<string, () => TypedAction<string>>;
export type XsPropsAction<T> = ActionCreator<string, (props: T) => T & TypedAction<string>>;
export type XsCreatorAction<R, P extends unknown[]> = FunctionWithParametersType<P, R & TypedAction<string>> & TypedAction<string>;
export type XsAction = XsEmptyAction | XsPropsAction<any> | XsCreatorAction<any, any>;
