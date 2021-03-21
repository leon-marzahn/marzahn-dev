import { createFeatureSelector } from '@ngrx/store';
import { CounterXsStoreState } from './counter.xs-store';

export const selectBasicStore = createFeatureSelector<{
  counterStore: CounterXsStoreState
}>('basic-store');
