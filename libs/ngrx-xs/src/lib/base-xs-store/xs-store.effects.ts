import { Action, ActionCreator, Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { XsStoreActions } from './xs-store.actions';
import { tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Injector } from '@angular/core';

export class XsStoreEffects<StateType, ActionsType extends XsStoreActions = XsStoreActions> {
  public error$: any;

  protected store: Store<StateType>;
  protected actions$: Actions;

  constructor(
    protected injector: Injector,
    protected actions: ActionsType
  ) {
    this.store = this.injector.get(Store) as Store<any>;
    this.actions$ = this.injector.get(Actions) as Actions;

    this.createEffects();
  }

  protected createEffects(): void {
    this.error$ = createEffect(() => this.actions$.pipe(
      ofType(this.actions.error),
      tap(action => this.actionCallback(action, true))
    ), { dispatch: false });
  }

  protected actionCallback(action: Action, isError: boolean = false): void {
    this.onAction(this.actions.error, action, ({ error }) => this.onErrorAction(error));

    if (isError) {
      return;
    }
  }

  protected onErrorAction(error: HttpErrorResponse | Error | string): void {
  }

  protected onAction<PayloadType>(
    expectedAction: ActionCreator<string, (props: any) => PayloadType & Action>,
    action: Action,
    callback: (action: PayloadType & Action) => void
  ): void {
    if (action.type === expectedAction.type) callback(action as PayloadType & Action);
  }
}
