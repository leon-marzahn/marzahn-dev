import { Provider } from '@angular/core';
import { NGX_TRANSLATE_HTTP_YAML_LOADER_FILE_EXTENSION, NGX_TRANSLATE_HTTP_YAML_LOADER_PREFIX } from './tokens';
import { NgxTranslateHttpYamlLoader } from './http-yaml.loader';

const DEFAULT_PREFIX = '/assets/i18n';
const DEFAULT_FILE_EXTENSION = 'yaml';

export const provideNgxTranslateHttpYamlLoader = (
  options?: {
    prefix?: string;
    fileExtension?: string;
  }
): Provider[] => {
  const prefix = options?.prefix ?? DEFAULT_PREFIX;
  const fileExtension = options?.fileExtension ?? DEFAULT_FILE_EXTENSION;

  return [
    NgxTranslateHttpYamlLoader,

    {
      provide: NGX_TRANSLATE_HTTP_YAML_LOADER_PREFIX,
      useValue: prefix
    },
    {
      provide: NGX_TRANSLATE_HTTP_YAML_LOADER_FILE_EXTENSION,
      useValue: fileExtension
    }
  ];
};
