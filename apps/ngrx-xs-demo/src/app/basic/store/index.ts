import { counterStore } from './counter.store';

export * from './counter.store';

export const basicStoreReducers = {
  counterStore: counterStore.getReducer()
};

export const basicStoreEffectsProviders = [
  ...counterStore.getEffectsProviders()
];
