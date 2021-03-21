import { MemoizedSelector } from '@ngrx/store';

export interface XsStoreSelectors<State> {
  selectState: MemoizedSelector<State, State>;
}
