import { InjectionToken } from '@angular/core';
import { NgxTranslateLoader } from './translate.loader';
import { NgxTranslateStore } from './translate.store';

export const NGX_TRANSLATE_IS_ROOT = new InjectionToken<boolean>('@marzahn-dev/ngx-translate: Is root');

export const NGX_TRANSLATE_STORE = new InjectionToken<NgxTranslateStore>('@marzahn-dev/ngx-translate: Store');

export const NGX_TRANSLATE_LOADER = new InjectionToken<NgxTranslateLoader>('@marzahn-dev/ngx-translate: Loader');
export const NGX_TRANSLATE_DEFAULT_LANGUAGE = new InjectionToken<string | undefined>('@marzahn-dev/ngx-translate: Default language');
export const NGX_TRANSLATE_SHOULD_ISOLATE = new InjectionToken<boolean>('@marzahn-dev/ngx-translate: Should isolate');
export const NGX_TRANSLATE_SHOULD_EXTEND = new InjectionToken<boolean>('@marzahn-dev/ngx-translate: Should extend');
