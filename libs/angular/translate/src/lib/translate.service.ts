import { computed, effect, inject, Injectable, isSignal, Signal, signal } from '@angular/core';
import { NgxTranslateLoader } from './translate.loader';
import {
  NGX_TRANSLATE_DEFAULT_LANGUAGE,
  NGX_TRANSLATE_IS_ROOT,
  NGX_TRANSLATE_LOADER,
  NGX_TRANSLATE_SHOULD_EXTEND,
  NGX_TRANSLATE_SHOULD_ISOLATE,
  NGX_TRANSLATE_STORE
} from './tokens';
import { distinctUntilChanged, filter, map, Observable, take } from 'rxjs';
import { at, isEqual, isNull } from 'lodash-es';
import { NgxTranslateStore } from './translate.store';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class NgxTranslateService {
  /**
   * The used store.
   */
  public readonly store: NgxTranslateStore;

  /// --- Signals --- ///

  /**
   * Whether the service is ready to be used.
   */
  public readonly ready = computed(() => this._ready() && !this.loading());

  /**
   * Whether the service is currently loading translations.
   */
  public readonly loading = computed(() => this._loading());

  /// --- Observables --- ///

  /**
   * Whether the service is ready to be used.
   */
  public ready$ = toObservable(this.ready);

  /**
   * Whether the service is currently loading translations.
   */
  public loading$ = toObservable(this.loading);

  private readonly _desiredLanguage: Signal<string | undefined>;

  private readonly _ready = signal<boolean>(false);
  private readonly _loading = signal<boolean>(false);

  private readonly _isRoot: boolean;
  private readonly _loader: NgxTranslateLoader;
  private readonly _shouldIsolate: boolean;
  private readonly _shouldExtend: boolean;

  public constructor() {
    this._isRoot = Boolean(inject(NGX_TRANSLATE_IS_ROOT, { optional: true }));
    const shouldExtend = inject(NGX_TRANSLATE_SHOULD_EXTEND, { optional: true });
    this._shouldExtend = !isNull(shouldExtend) ? shouldExtend : false;
    this._shouldIsolate = inject(NGX_TRANSLATE_SHOULD_ISOLATE);

    this.store = this._shouldIsolate ? new NgxTranslateStore() : inject(NGX_TRANSLATE_STORE);
    this._loader = inject(NGX_TRANSLATE_LOADER);

    if (this._isRoot || this._shouldIsolate) this.setupForRoot();

    const defaultLanguage = this.store.defaultLanguage();
    if (defaultLanguage) this.updateTranslations(defaultLanguage);

    this._desiredLanguage = computed(() => this.store.desiredLanguage(), {
      equal: (a, b) => isEqual(a, b)
    });

    effect(() => {
      const desiredLanguage = this._desiredLanguage();
      if (desiredLanguage) this.updateTranslations(desiredLanguage);
    }, { allowSignalWrites: true });
  }

  private setupForRoot(): void {
    this.store.defaultLanguage.set(inject(NGX_TRANSLATE_DEFAULT_LANGUAGE) ?? undefined);
  }

  /**
   * Changes the language to the desired language.
   *
   * @param language The desired language.
   */
  public use(language: string): void {
    if (language === this.store.currentLanguage()) return;
    this.store.desiredLanguage.set(language);
  }

  /**
   * Instantly translates the given key for the current language. May return `undefined` if translations are not loaded yet. Generally
   * not encouraged to use this.
   *
   * @param key The key to use for translation.
   */
  public instant(key: string | string[]): string | object | undefined {
    return this.getTranslation(this.store.translationsByCurrentLanguage(), key);
  }

  /**
   * Creates a {@link Signal} with the translation of the given key for the current language. May return `undefined` if translations are
   * not loaded yet.
   *
   * @param key The key to use for translation.
   */
  public computed(key: string | string[] | undefined | Signal<string | string[] | undefined>): Signal<string | object | undefined> {
    if (isSignal(key)) {
      return computed(() => this.getTranslation(this.store.translationsByCurrentLanguage(), key()));
    }

    return computed(() => this.getTranslation(this.store.translationsByCurrentLanguage(), key));
  }

  /**
   * Creates an {@link Observable} that completes after a translation has been found. This {@link Observable} will never complete if no
   * translation was found.
   *
   * @param key The key to use for translation.
   */
  public get(key: string | string[]): Observable<string | object> {
    return this.stream(key).pipe(
      filter(value => Boolean(value)),
      map(value => value as string | object),
      take(1)
    );
  }

  /**
   * Creates an {@link Observable} to stream a translation live.
   *
   * @param key The key to use for translation.
   */
  public stream(key: string | string[]): Observable<string | object | undefined> {
    return this.store.translationsByCurrentLanguage$.pipe(
      map(translations => this.getTranslation(translations, key)),
      distinctUntilChanged((a, b) => isEqual(a, b))
    );
  }

  /**
   * Manually set translations for a specific language.
   *
   * @param language The language to set translations for.
   * @param translations The translations object.
   * @param shouldExtend If set, translations will be merged instead of overwritten.
   */
  public setTranslations(language: string, translations: Record<string, object>, shouldExtend = false): void {
    this.store.translations.mutate(existingTranslations => {
      if (shouldExtend && existingTranslations[language]) {
        existingTranslations[language] = { ...translations, ...existingTranslations[language] };
      } else {
        existingTranslations[language] = translations;
      }
    });
  }

  /**
   * Gets a translation from a translations object by key.
   *
   * @param translations The translations object.
   * @param key The key to use for translation.
   */
  public getTranslation(translations: Record<string, string | object>, key: string | string[] | undefined): string | object | undefined {
    if (!key) return undefined;
    const atPath = at<string | object | undefined>(translations, key);
    if (!atPath.length) return undefined;
    return atPath[0] ?? undefined;
  }

  /**
   * Gets the current browser language.
   *
   * @example en
   */
  public getBrowserLanguage(): string | undefined {
    let browserLanguage = this.getBrowserCultureLanguage();

    if (typeof browserLanguage === 'undefined') return undefined;
    if (browserLanguage.indexOf('-') !== -1) browserLanguage = browserLanguage.split('-')[0];
    if (browserLanguage.indexOf('_') !== -1) browserLanguage = browserLanguage.split('_')[0];

    return browserLanguage;
  }

  /**
   * Gets the current browser culture language.
   *
   * @example en-GB
   */
  public getBrowserCultureLanguage(): string | undefined {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') return undefined;

    let browserCultureLanguage = window.navigator.languages ? window.navigator.languages[0] : null;
    browserCultureLanguage = browserCultureLanguage || window.navigator.language;

    return browserCultureLanguage;
  }

  private updateTranslations(language: string): void {
    this._loading.set(true);

    this._loader.get(language).pipe(take(1)).subscribe({
      next: translations => {
        this.store.translations.mutate(existingTranslations => {
          if (this._shouldExtend && existingTranslations[language]) {
            existingTranslations[language] = { ...translations, ...existingTranslations[language] };
          } else {
            existingTranslations[language] = translations;
          }
        });
        this._loading.set(false);
        if (!this._ready()) this._ready.set(true);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }
}
