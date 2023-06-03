import { NgxTranslateLoader } from '@marzahn-dev/ngx-translate';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NGX_TRANSLATE_HTTP_YAML_LOADER_FILE_EXTENSION, NGX_TRANSLATE_HTTP_YAML_LOADER_PREFIX } from './tokens';
import { load as yamlLoad, FAILSAFE_SCHEMA } from 'js-yaml';

@Injectable()
export class NgxTranslateHttpYamlLoader extends NgxTranslateLoader {
  protected prefix: string;
  protected fileExtension: string;

  public constructor(
    protected httpClient: HttpClient
  ) {
    super();

    this.prefix = inject(NGX_TRANSLATE_HTTP_YAML_LOADER_PREFIX);
    this.fileExtension = inject(NGX_TRANSLATE_HTTP_YAML_LOADER_FILE_EXTENSION);
  }

  public get(language: string): Observable<Record<string, object>> {
    return this.httpClient.get(`${this.prefix}/${language}.${this.fileExtension}`, { responseType: 'text' }).pipe(
      map(response => {
        try {
          return yamlLoad(response, { schema: FAILSAFE_SCHEMA }) as Record<string, object>;
        } catch (error) {
          console.error(error);
          return {};
        }
      })
    );
  }
}
