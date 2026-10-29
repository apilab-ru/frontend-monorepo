import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DataService } from './data.service';
import { GoogleDocApiService } from './google-doc.api.service';

describe('DataService', () => {
  it('groups spreadsheet items under headings and skips empty or ungrouped rows', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GoogleDocApiService,
          useValue: {
            fetchRows: () =>
              of([
                [null, 'Ungrouped item', null],
                ['Packing', null, null],
                [null, 'Passport', 'Check expiry'],
                [null, null, null],
                [null, 'Tickets', null],
                ['Before leaving', null, null],
                [null, 'Lock the door', null],
              ]),
          },
        },
      ],
    });
    let result;
    TestBed.inject(DataService)
      .loadPoints()
      .subscribe((groups) => {
        result = groups;
      });
    expect(result).toEqual([
      {
        title: 'Packing',
        list: [
          { text: 'Passport', description: 'Check expiry' },
          { text: 'Tickets', description: undefined },
        ],
      },
      {
        title: 'Before leaving',
        list: [{ text: 'Lock the door', description: undefined }],
      },
    ]);
  });
});
