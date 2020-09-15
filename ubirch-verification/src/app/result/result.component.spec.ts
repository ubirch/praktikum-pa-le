import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultComponent } from './result.component';
import TestData from '../../assets/test-data.json'
import responseData from '../../assets/response-test-data.json'
import { VerificationService } from '../services/verification.service';
import { ResponseDataService } from '../services/response-data.service';
import { CompileShallowModuleMetadata } from '@angular/compiler';

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
    component.responseInfo = {
      type: undefined,
      header: undefined,
      info: undefined
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the success icons if the verification was successfull', () => {
    //
    component.responseCode = 3;
    component.hash = '1ENYKuJyh2ab/a7ozIyEHLFdVX+ERFIKjU5GRjgTaI4=';
    component.handleResponse(component.responseCode);
    component.showSeal(component.responseCode, component.hash)
    fixture.detectChanges();
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
    
      component.responseCode = 0;
      component.handleResponse(component.responseCode);
      component.showSeal(component.responseCode, null);      
      fixture.detectChanges();
      expect(component.responseInfo).toEqual({
        type: 'error',
        header: 'Verifikation fehlgeschlagen',
        info: 'Es konnte kein Zertifikat gefunden werden.'
      })
      expect(component.seal.src).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#UbirchSeal')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#UbirchSeal').src).toContain("ubirch_verify_wrong.png")
      
  })

  it('should properly handly errors with a 500 status', () => {
    
    component.responseCode = 6;
    component.hash = null;
    component.handleResponse(component.responseCode);
    component.showSeal(component.responseCode, component.hash)
    fixture.detectChanges();
    expect(component.responseInfo).toEqual({
      type: 'errorT',
      header: 'Fehler',
      info: 'Es ist ein interner Server Fehler aufgetreten. Bitte versuchen sie es später erneut.'
    });
    expect(fixture.nativeElement.querySelector('#toast')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#UbirchSeal')).toBeFalsy();
  })

  it('should properly handle other unexpected errors', () => {
    component.responseCode = 5
    component.handleResponse(component.responseCode);
    component.showSeal(component.responseCode, component.hash)
    fixture.detectChanges();
    expect(component.responseInfo).toEqual({
      type: 'errorT',
      header: 'Fehler',
      info: 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen sie es später erneut.'
    });
    expect(fixture.nativeElement.querySelector('#toast')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#UbirchSeal')).toBeFalsy();
  })
});
