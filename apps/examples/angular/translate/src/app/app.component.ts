import { Component, OnInit } from '@angular/core';
import { NgxTranslateHttpYamlLoader, provideNgxTranslateHttpYamlLoader } from '@marzahn-dev/ngx-translate/loaders/http-yaml';
import { HttpClientModule } from '@angular/common/http';
import { NgxTranslateService, provideNgxTranslate } from '@marzahn-dev/ngx-translate';
import { TestComponent } from './test.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'marzahn-dev-root',
  template: '<marzahn-dev-test/>',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    TestComponent
  ],
  providers: [
    provideNgxTranslateHttpYamlLoader({
      prefix: '/assets/i18n/app'
    }),
    provideNgxTranslate({
      defaultLanguage: 'en',
      loader: NgxTranslateHttpYamlLoader
    })
  ]
})
export class AppComponent implements OnInit {
  public constructor(
    public translate: NgxTranslateService
  ) {
  }

  public ngOnInit(): void {
    this.translate.stream('test').subscribe(value => console.log(value));
    this.translate.use('de');

    this.translate.store.defaultLanguageChange.subscribe(value => console.log('Default language changed', value));
    this.translate.store.desiredLanguageChange.subscribe(value => console.log('Desired language changed', value));
    this.translate.store.currentLanguageChange.subscribe(value => console.log('Current language changed', value));
    this.translate.store.translationsChange.subscribe(value => console.log('Translations changed', value));
  }
}
