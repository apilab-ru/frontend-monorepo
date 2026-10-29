import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { GoogleDocApiService } from './google-doc.api.service';

describe('GoogleDocApiService', () => {
  let service: GoogleDocApiService;
  let http: HttpTestingController;
  const url = `https://docs.google.com/spreadsheets/d/${environment.doc}/gviz/tq?tqx=out:json&tq&gid=${environment.gridId}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GoogleDocApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('parses Google Visualization responses and preserves empty cell values', () => {
    const next = jest.fn();
    service.fetchRows().subscribe(next);
    const request = http.expectOne(url);
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('text');
    request.flush(
      '/*O_o*/\ngoogle.visualization.Query.setResponse({"version":"0.6","status":"ok","table":{"cols":[],"rows":[{"c":[{"v":"Packing"},null,{"v":""}]}]}});'
    );
    expect(next).toHaveBeenCalledWith([['Packing', null, '']]);
  });

  it('loads the spreadsheet and tab selected by the user', () => {
    service
      .fetchRows('https://docs.google.com/spreadsheets/d/custom-sheet/edit#gid=25')
      .subscribe();
    http
      .expectOne(
        'https://docs.google.com/spreadsheets/d/custom-sheet/gviz/tq?tqx=out:json&tq&gid=25'
      )
      .flush('google.visualization.Query.setResponse({"table":{"rows":[]}});');
  });

  it('reports a response that has no table', () => {
    const error = jest.fn();
    service.fetchRows().subscribe({ error });
    http.expectOne(url).flush('Invalid response');
    expect(error).toHaveBeenCalledWith(
      new Error('The spreadsheet response does not contain a table.')
    );
  });

  it('forwards HTTP errors to the subscriber', () => {
    const error = jest.fn();
    service.fetchRows().subscribe({ error });
    http
      .expectOne(url)
      .flush('Unavailable', { status: 503, statusText: 'Service Unavailable' });
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ status: 503 }));
  });
});
