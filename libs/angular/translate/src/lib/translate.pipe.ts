import { inject, Pipe, PipeTransform, signal } from '@angular/core';
import { NgxTranslateService } from './translate.service';

@Pipe({
  name: 'ngxTranslate',
  standalone: true,
  pure: false
})
export class NgxTranslatePipe implements PipeTransform {
  public translate = inject(NgxTranslateService);

  private _key = signal<string | string[] | undefined>(undefined);
  private _translation = this.translate.computed(this._key);

  public transform(key: string | string[] | undefined): string | object | undefined {
    setTimeout(() => this._key.set(key));
    return this._translation();
  }
}
