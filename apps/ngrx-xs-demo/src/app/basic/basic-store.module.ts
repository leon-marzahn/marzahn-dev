import { InjectionToken, NgModule } from '@angular/core';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { basicStoreEffectsProviders, basicStoreReducers } from './store';

const BASIC_STORE_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<any>>('Basic Store Reducers');

@NgModule({
  imports: [
    StoreModule.forFeature('basic-store', BASIC_STORE_REDUCER_TOKEN),
    EffectsModule.forFeature()
  ],
  providers: [
    {
      provide: BASIC_STORE_REDUCER_TOKEN,
      useValue: basicStoreReducers
    },
    ...basicStoreEffectsProviders
  ]
})
export class BasicStoreModule {
}
