import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { counterStore } from './store';
import isNull from 'lodash-es/isNull';

@Component({
  selector: 'marzahn-dev-basic-component',
  templateUrl: './basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicComponent implements OnInit {
  public counter$: Observable<number>;

  constructor(
    private store: Store<any>
  ) {
  }

  public ngOnInit(): void {
    this.counter$ = this.store.pipe(
      select(counterStore.selectors.selectCounter)
    );
  }

  public onIncreaseCounter(): void {
    this.store.dispatch(counterStore.actions.increaseCounter());
  }

  public onDecreaseCounter(): void {
    this.store.dispatch(counterStore.actions.decreaseCounter());
  }

  public onSetCounter(value: number): void {
    this.store.dispatch(counterStore.actions.setCounter({ value: !isNull(value) ? value : 0 }));
  }
}
