import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

export interface XsStoreErrorPayload {
  action: Action;
  error: HttpErrorResponse | Error | string;
}
