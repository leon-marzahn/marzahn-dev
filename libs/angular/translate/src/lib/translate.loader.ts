import { Observable } from 'rxjs';

export abstract class NgxTranslateLoader {
  public abstract get(language: string): Observable<Record<string, object>>;
}
