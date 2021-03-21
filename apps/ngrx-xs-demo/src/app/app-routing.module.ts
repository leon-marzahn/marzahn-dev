import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'basic'
  },

  {
    path: 'basic',
    loadChildren: () => import('./basic/basic.module').then(m => m.BasicModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
