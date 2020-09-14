import { TestBed } from '@angular/core/testing';

import { FillDataService } from './fill-data.service';

describe('FillDataService', () => {
  let service: FillDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FillDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
