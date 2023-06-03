import { computed, effect, EventEmitter, Injectable, signal } from '@angular/core';
import { distinctUntilChanged, Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { isEqual } from 'lodash-es';

@Injectable()
export class NgxTranslateStore {
  /// --- Signals --- ///

  /**
   * The default language to fall back to when translations are missing in the current language.
   */
  public defaultLanguage = signal<string | undefined>(undefined);

  /**
   * The currently desired language.
   */
  public desiredLanguage = signal<string | undefined>(undefined);

  /**
   * The current language being used. Will fall back to default language if desired language is not set.
   */
  public currentLanguage = computed(() => this.desiredLanguage() ?? this.defaultLanguage() ?? undefined);

  /**
   * The parsed translations object.
   */
  public translations = signal<Record<string, object>>({});

  /**
   * The parsed translations object for the current language.
   */
  public translationsByCurrentLanguage = computed(() => {
    const desiredLanguage = this.desiredLanguage();
    const defaultLanguage = this.defaultLanguage();
    const translations = this.translations();

    const currentLanguageTranslations = desiredLanguage ? translations[desiredLanguage] as Record<string, string | object> : undefined;
    const defaultLanguageTranslations = defaultLanguage ? translations[defaultLanguage] as Record<string, string | object> : undefined;

    if (currentLanguageTranslations) return { ...(defaultLanguageTranslations ?? {}), ...currentLanguageTranslations };
    return defaultLanguageTranslations ?? {};
  }, {
    equal: (a, b) => isEqual(a, b)
  });

  /// --- Signals --- ///

  /**
   * An {@link Observable} of the parsed translations object for the current language.
   */
  public translationsByCurrentLanguage$: Observable<Record<string, string | object>>;

  /// --- Events --- ///

  /**
   * Emits if the default language changes. Does not count initial value provided.
   */
  public defaultLanguageChange = new EventEmitter<string | undefined>();

  /**
   * Emits if the desired language changes.
   */
  public desiredLanguageChange = new EventEmitter<string | undefined>();

  /**
   * Emits if the current language changes.
   */
  public currentLanguageChange = new EventEmitter<string | undefined>();

  /**
   * Emits if the translations change.
   */
  public translationsChange = new EventEmitter<Record<string, object>>();

  public constructor() {
    this.translationsByCurrentLanguage$ = toObservable(this.translationsByCurrentLanguage).pipe(
      distinctUntilChanged((a, b) => isEqual(a, b))
    );

    effect(() => this.defaultLanguageChange.emit(this.defaultLanguage()));
    effect(() => this.desiredLanguageChange.emit(this.desiredLanguage()));
    effect(() => this.currentLanguageChange.emit(this.currentLanguage()));
    effect(() => this.translationsChange.emit(this.translations()));
  }
}
