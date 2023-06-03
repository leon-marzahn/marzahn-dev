import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxTranslateHttpYamlLoader } from './http-yaml.loader';
import { NGX_TRANSLATE_HTTP_YAML_LOADER_FILE_EXTENSIONS, NGX_TRANSLATE_HTTP_YAML_LOADER_PREFIX } from './tokens';
import { of, throwError } from 'rxjs';

describe('NgxTranslateHttpYamlLoader', () => {
  let loader: NgxTranslateHttpYamlLoader;

  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        NgxTranslateHttpYamlLoader,

        {
          provide: NGX_TRANSLATE_HTTP_YAML_LOADER_PREFIX,
          useValue: 'prefix'
        },
        {
          provide: NGX_TRANSLATE_HTTP_YAML_LOADER_FILE_EXTENSIONS,
          useValue: ['.yaml', '.yml']
        }
      ]
    });

    loader = TestBed.inject(NgxTranslateHttpYamlLoader);

    httpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(loader).toBeTruthy();
  });

  it('should return after first request', done => {
    jest
      .spyOn(httpClient, 'get')
      .mockReturnValueOnce(throwError(() => new Error()))
      .mockReturnValueOnce(of('test: test'));

    loader.get('en').subscribe(value => {
      console.log(value);
      done();
    });
  });
});
