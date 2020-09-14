import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultComponent } from './result.component';
import TestData from '../../assets/test-data.json'
import responseData from '../../assets/response-test-data.json'
import { VerificationService } from '../services/verification.service';
import { ResponseDataService } from '../services/response-data.service';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;
  let verificationService: VerificationService;
  let VerificationServiceStub: Partial<VerificationService>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultComponent ],
      providers: [{provide: VerificationService, useValue: VerificationServiceStub}, {provide: ResponseDataService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    pending()
    expect(component).toBeTruthy();
  });

  it('should display the success icons if the verification was successfull', () => {
    //
    pending();
    expect(component.responseCode).toEqual(3);
    expect(component.responseInfo).toEqual({
      type: 'success',
      header: 'Verifikation erfolgreich',
      info: 'Die Verifikation Ihres Tests war erfolgreich'
    })
    expect(component.seal.src).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#UbirchSeal')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#UbirchSeal').src).toContain("ubirch_verify_right.png")
    
    })

  it('should display the fail icon if verification was not successfull', () => {
    
      pending();
      
      fixture.detectChanges();
      expect(component.responseCode).toEqual(4);
      expect(component.responseInfo).toEqual({
        type: 'error',
        header: 'Verifikation fehlgeschlagen',
        info: 'Verification failed empty response'
      })
      expect(component.seal.src).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#UbirchSeal')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#UbirchSeal').src).toContain("ubirch_verify_wrong.png")
      
  })

  it('should properly handly errors with a 500 status', () => {
    pending();
    const error = {status: 500};
    component.handleResponse(error);
    fixture.detectChanges();
    expect(component.responseInfo).toEqual({
      type: 'errorT',
      header: 'Fehler',
      info: 'Es ist ein interner Server Fehler aufgetreten. Bitte versuchen sie es später erneut.'
    });
    expect(fixture.nativeElement.querySelector('#toast')).toBeTruthy();
  })

  it('should properly handle other unexpected errors', () => {
    pending();
    const error = {status: 400};

    component.handleResponse(error);
    fixture.detectChanges();
    expect(component.responseInfo).toEqual({
      type: 'errorT',
      header: 'Fehler',
      info: 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen sie es später erneut.'
    });
    expect(fixture.nativeElement.querySelector('#toast')).toBeTruthy();
  })
});
