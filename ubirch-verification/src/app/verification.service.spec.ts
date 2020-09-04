import { TestBed } from '@angular/core/testing';

import { VerificationService } from './verification.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('VerificationService', () => {
  let service: VerificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(VerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
