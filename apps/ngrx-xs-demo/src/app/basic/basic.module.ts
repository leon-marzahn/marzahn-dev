import { NgModule } from '@angular/core';
import { BasicComponent } from './basic.component';
import { RouterModule } from '@angular/router';
import { BasicStoreModule } from './basic-store.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    BasicComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: BasicComponent
    }]),
    FormsModule,

    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TooltipModule,

    BasicStoreModule
  ]
})
export class BasicModule {
}
