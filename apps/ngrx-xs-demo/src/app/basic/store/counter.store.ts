import { CounterXsStore } from './counter.xs-store';
import { createSelector } from '@ngrx/store';
import { selectBasicStore } from './store.selector';

export const counterStore = new CounterXsStore({
  actionLabel: 'Counter Store',
  stateSelector: createSelector(selectBasicStore, state => state.counterStore)
});
