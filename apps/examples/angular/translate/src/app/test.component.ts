import { Component, effect } from '@angular/core';
import { NgxTranslateHttpYamlLoader, provideNgxTranslateHttpYamlLoader } from '@marzahn-dev/ngx-translate/loaders/http-yaml';
import { HttpClientModule } from '@angular/common/http';
import { NgxTranslateService, provideNgxTranslateForFeature } from '@marzahn-dev/ngx-translate';

@Component({
  selector: 'marzahn-dev-test',
  template: '',
  standalone: true,
  imports: [
    HttpClientModule
  ],
  providers: [
    provideNgxTranslateHttpYamlLoader({
      prefix: '/assets/i18n/test'
    }),
    provideNgxTranslateForFeature({
      loader: NgxTranslateHttpYamlLoader,
      shouldExtend: true
    })
  ]
})
export class TestComponent {
  public testString = this.translate.computed('test2');

  public constructor(
    private translate: NgxTranslateService
  ) {
    effect(() => console.log(this.testString()));
  }
}
