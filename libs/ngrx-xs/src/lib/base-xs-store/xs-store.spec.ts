import { XsStore } from './xs.store';
import { TestBed } from '@angular/core/testing';
import { ActionReducerMap, createAction, createFeatureSelector, createSelector, on, select, Store, StoreModule } from '@ngrx/store';
import { InjectionToken, Injector } from '@angular/core';
import { XsStoreActions } from './xs-store.actions';
import { XsEmptyAction, XsReducer } from '../util';
import { take, tap } from 'rxjs/operators';
import { Actions, createEffect, EffectsModule, ofType } from '@ngrx/effects';
import { XsStoreEffects } from './xs-store.effects';
import { HttpErrorResponse } from '@angular/common/http';
import { marbles } from 'rxjs-marbles';
import { provideMockActions } from '@ngrx/effects/testing';

const selectState = createFeatureSelector('reducers');
const TEST_REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<any>>('TEST_REDUCERS');

describe('XsStore - Simple', () => {
  interface TestStoreState {
    test1: string;
  }

  const testStore = new XsStore<TestStoreState>({
    actionLabel: 'Test Store',
    stateSelector: createSelector(selectState, (state: any) => state.testStore),
    initialState: {
      test1: 'TestString'
    }
  });

  let store: Store<any>;
  let actions$: Actions;
  let effectsInstance: XsStoreEffects<TestStoreState>;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot({}),
      StoreModule.forFeature('reducers', TEST_REDUCERS_TOKEN)
    ],
    providers: [
      {
        provide: TEST_REDUCERS_TOKEN,
        useValue: {
          testStore: testStore.getReducer()
        }
      },
      ...testStore.getEffectsProviders(),
      provideMockActions(() => actions$)
    ]
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    effectsInstance = TestBed.inject(testStore.effectsToken);
  });

  it('should create store', async () => {
    expect(testStore).toBeTruthy();
    expect(effectsInstance).toBeTruthy();
    expect(await store.pipe(select(testStore.selectors.selectState), take(1)).toPromise()).toEqual({
      test1: 'TestString'
    });
  });
});

describe('XsStore - Advanced', () => {
  interface TestXsStoreState {
    test1: boolean;
  }

  interface TestXsStoreActions extends XsStoreActions {
    test1: XsEmptyAction;
    test2: XsEmptyAction;
  }

  class TestXsStore extends XsStore<TestXsStoreState, TestXsStoreActions, TestXsStoreEffects> {
    protected getInitialState(): TestXsStoreState {
      return {
        ...super.getInitialState(),
        test1: false
      };
    }

    protected createActions(label: string): TestXsStoreActions {
      return {
        ...super.createActions(label),
        test1: createAction(XsStore.getActionType(label, 'TEST_1')),
        test2: createAction(XsStore.getActionType(label, 'TEST_2'))
      };
    }

    protected createReducerArray(initialState: TestXsStoreState): XsReducer<TestXsStoreState>[] {
      return [
        ...super.createReducerArray(initialState),
        on(this.actions.test1, state => ({ ...state, test1: true })),
        on(this.actions.test2, state => state)
      ];
    }

    protected createEffects(injector: Injector): TestXsStoreEffects {
      return new TestXsStoreEffects(injector, this.actions);
    }
  }

  class TestXsStoreEffects extends XsStoreEffects<TestXsStoreState, TestXsStoreActions> {
    public test1$: any;
    public test2$: any;

    protected createEffects(): void {
      super.createEffects();

      this.test1$ = createEffect(() => this.actions$.pipe(
        ofType(this.actions.test1),
        tap(action => this.actionCallback(action))
      ), { dispatch: false });
    }

    protected onErrorAction(error: HttpErrorResponse | Error | string): void {
      super.onErrorAction(error);
      this.store.dispatch(this.actions.test2());
    };
  }

  const testStore = new TestXsStore({
    actionLabel: 'Test Store',
    stateSelector: createSelector(selectState, (state: any) => state.testStore)
  });

  let store: Store<any>;
  let actions$: Actions;
  let effectsInstance: TestXsStoreEffects;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot(),
      StoreModule.forFeature('reducers', TEST_REDUCERS_TOKEN)
    ],
    providers: [
      {
        provide: TEST_REDUCERS_TOKEN,
        useValue: {
          testStore: testStore.getReducer()
        }
      },
      ...testStore.getEffectsProviders(),
      provideMockActions(() => actions$)
    ]
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    effectsInstance = TestBed.inject(testStore.effectsToken);
  });

  it('should create store', async () => {
    expect(testStore).toBeTruthy();
    expect(effectsInstance).toBeTruthy();
    expect(await store.pipe(select(testStore.selectors.selectState), take(1)).toPromise()).toEqual({
      test1: false
    });
  });

  it('should reduce action', async () => {
    store.dispatch(testStore.actions.test1());
    expect(await store.pipe(select(testStore.selectors.selectState), take(1)).toPromise()).toEqual({
      test1: true
    });
  });

  it('should dispatch test2 on dispatching error', marbles(m => {
    spyOn(store, 'dispatch').and.stub();

    actions$ = m.hot('-a-b-', {
      a: testStore.actions.test1(),
      b: testStore.actions.error({ error: 'error', action: testStore.actions.error })
    });

    effectsInstance.test1$.subscribe(() => {
      effectsInstance.error$.subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledWith(testStore.actions.test2());
      });
    });
  }));
});
