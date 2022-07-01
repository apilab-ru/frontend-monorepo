import { TestBed } from '@angular/core/testing';

import { GoogleDocApiService } from './google-doc.api.service';

describe('GoogleDocApiService', () => {
  let service: GoogleDocApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleDocApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
