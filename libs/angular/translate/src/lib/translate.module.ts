import { Provider, Type } from '@angular/core';
import {
  NGX_TRANSLATE_DEFAULT_LANGUAGE,
  NGX_TRANSLATE_IS_ROOT,
  NGX_TRANSLATE_LOADER,
  NGX_TRANSLATE_SHOULD_EXTEND,
  NGX_TRANSLATE_SHOULD_ISOLATE,
  NGX_TRANSLATE_STORE
} from './tokens';
import { NgxTranslateLoader } from './translate.loader';
import { NgxTranslateService } from './translate.service';
import { NgxTranslateStore } from './translate.store';

export interface NgxTranslateModuleConfig {
  /**
   * The loader used to load the translations.
   */
  loader: Type<NgxTranslateLoader>;

  /**
   * If set, translations won't be stored or loaded globally.
   */
  shouldIsolate?: boolean;
}

export interface NgxTranslateRootModuleConfig extends NgxTranslateModuleConfig {
  /**
   * The default language to load.
   */
  defaultLanguage?: string;
}

export interface NgxTranslateFeatureModuleConfig extends NgxTranslateModuleConfig {
  /**
   * If set, extends the parent module's translations instead of overriding them.
   */
  shouldExtend?: boolean;
}

export const provideNgxTranslate = (config: NgxTranslateRootModuleConfig): Provider[] => [
  {
    provide: NGX_TRANSLATE_IS_ROOT,
    useValue: true
  },
  {
    provide: NGX_TRANSLATE_STORE,
    useClass: NgxTranslateStore
  },

  {
    provide: NGX_TRANSLATE_DEFAULT_LANGUAGE,
    useValue: config.defaultLanguage
  },

  ...provideDefault(config)
];

export const provideNgxTranslateForFeature = (config: NgxTranslateFeatureModuleConfig): Provider[] => [
  ...provideDefault(config),

  {
    provide: NGX_TRANSLATE_SHOULD_EXTEND,
    useValue: config.shouldExtend ?? false
  }
];

const provideDefault = (config: NgxTranslateModuleConfig): Provider[] => [
  NgxTranslateService,

  {
    provide: NGX_TRANSLATE_LOADER,
    useClass: config.loader
  },
  {
    provide: NGX_TRANSLATE_SHOULD_ISOLATE,
    useValue: config.shouldIsolate ?? false
  }
];
