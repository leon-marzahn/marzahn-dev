# NGRX-XS
![npm bundle size](https://img.shields.io/bundlephobia/min/@marzahn-dev/ngrx-xs?style=for-the-badge)

A inheritance and less boilerplate approach to NGRX.

This library uses immer for easier reducers.

### Usage

Creating a simple counter store

```typescript
export interface CounterXsStoreState {
  counter: number;
}

export interface CounterXsStoreActions extends XsStoreActions {
  increaseCounter: XsEmptyAction;
  decreaseCounter: XsEmptyAction;
}

export interface CounterXsStoreSelectors extends XsStoreSelectors<CounterXsStoreState> {
  selectCounter: MemoizedSelector<CounterXsStore, number>;
}

export class CounterXsStore extends XsStore<CounterXsStoreState, CounterXsStoreActions, CounterXsStoreEffects, CounterXsStoreSelectors> {
  protected getInitialState(): CounterXsStoreState {
    return { ...super.getInitialState(), counter: 0 };
  }

  protected createActions(label: string): CounterXsStoreActions {
    return {
      ...super.createActions(label),
  
      increaseCounter: createAction(XsStore.getActionType(label, 'INCREASE_COUNTER')),
      decreaseCounter: createAction(XsStore.getActionType(label, 'DECREASE_COUNTER'))
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
      })
    ];
  }

  protected createSelectors(stateSelector: MemoizedSelector<any, CounterXsStoreState>): CounterXsStoreSelectors {
    return {
      ...super.createSelectors(stateSelector),

      selectCounter: createSelector(stateSelector, state => state.counter)
    };
  }
}
```

Using the store

```typescript
// Creating the store instance
export const counterStore = new CounterXsStore({
  actionLabel: 'Counter Store',
  stateSelector: createSelector(createFeatureSelector('store'), state => state.counter)
});

const STORE_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<any>>('Store reducers');

@NgModule({
  imports: [
    StoreModule.forFeature('store', STORE_REDUCER_TOKEN),
    EffectsModule.forFeature()
  ],
  providers: [
    // Providing the store reducers
    {
      provide: BASIC_STORE_REDUCER_TOKEN,
      useValue: {
        counter: counterStore.getReducer()
      }
    }
  ]
})
export class BasicStoreModule {
}
```
