import { TestBed } from '@angular/core/testing';

import { VerificationService } from './verification.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import testData from '../assets/test-data.json'
import responseData from '../assets/response-test-data.json'
import testDataWrong from '../assets/test-data-wrong.json'
import responseDataWrong from '../assets/response-data-wrong.json'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('VerificationService', () => {
  let service: VerificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
      providers: [VerificationService]
    });
    service = TestBed.inject(VerificationService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should prepare the data correctly', () => {
    service.verify(testData)
    expect(service.json).toBeTruthy();
    expect(service.hash).toBeTruthy();
  })

  it('should get the correct data on a successfull call, with testdata', () => {
    service.verify(testData).subscribe((data: any) => {
      expect(data.body).toBe(responseData);
    });
    const req = httpMock.expectOne(service.verificationApiUrl, service.hash);
    expect(req.request.method).toBe('POST');

    req.flush(responseData);
    httpMock.verify();
  })

  it('should get a 404 response on a failed verification call', () => {
    service.verify(testDataWrong).subscribe((data: any) => {
      expect(data.status).toBe(404);
    });
    const req = httpMock.expectOne(service.verificationApiUrl, service.hash);
    expect(req.request.method).toBe('POST');

    req.error(null, responseDataWrong);
    httpMock.verify();
  })
});
