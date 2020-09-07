import { async, ComponentFixture, TestBed} from '@angular/core/testing';

import { FormularComponent } from './formular.component';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, CheckboxControlValueAccessor } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VerificationService } from '../verification.service';
import { DateTimeComponent } from './DateTime/date-time/date-time.component';
import TestData from '../../assets/test-data.json'
import responseData from '../../assets/response-test-data.json'

describe('FormularComponent', () => {
  let component: FormularComponent;
  let fixture: ComponentFixture<FormularComponent>;
  let verificationService: VerificationService;
  let VerificationServiceStub: Partial<VerificationService>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
      declarations: [ FormularComponent, DateTimeComponent ],
      providers: [{provide: VerificationService, useValue: VerificationServiceStub}, {provide: DateTimeComponent}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    VerificationServiceStub = {
      hash: null,

      verify(data){
          if(JSON.stringify(data) === JSON.stringify(TestData)){
            return responseData;
          }
      }

    };

    fixture = TestBed.createComponent(FormularComponent);
    verificationService = TestBed.inject(VerificationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be a valid form after test data is pasted, meaning all fields are correctly filled', ()  => {
    expect(component.form.valid).toBe(false);
    component.fillTestData();
    expect(component.form.valid).toBe(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#verifyButton').disabled).toBeFalse();
  });

  it('should disable the verify button if not all form fields are filled', () => {

    const verifyButton = fixture.nativeElement.querySelector('#verifyButton');
    expect(verifyButton.disabled).toBeTrue();
    
    //test fName
    component.fillTestData();
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.fName.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    //test gName
    component.fillTestData();
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.gName.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    //test idNumber
    component.fillTestData();
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.idNumber.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    //test ranNum
    component.fillTestData();
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.ranNum.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    // test testDateTime
    component.fillTestData();
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.testDateTime.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    // test testResult
    component.fillTestData();
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.testResult.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    // test testType
    component.fillTestData();
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.testType.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    // test birthDate
    component.fillTestData();
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.birthDate.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    // test labId
    component.fillTestData();
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.labId.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();
  })

  it('should disable the verify Button if first Name is not a string or longer than 50 characters', () => {
    const verifyButton = fixture.nativeElement.querySelector('#verifyButton');
    component.fillTestData();
    fixture.detectChanges();
    expect(component.fName.valid).toBeTrue();
    expect(component.form.valid).toBeTrue();
    expect(verifyButton.disabled).toBeFalse();

    component.fName.setValue(123);
    fixture.detectChanges();
    expect(component.fName.valid).toBeFalse();
    expect(component.form.valid).toBeFalse();
    expect(verifyButton.disabled).toBeTrue();

    component.fName.setValue('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    fixture.detectChanges();
    expect(component.fName.valid).toBeFalse();
    expect(component.form.valid).toBeFalse();
    expect(verifyButton.disabled).toBeTrue;
  })

  it('should disable the verify Button if given Name is not a string or longer than 50 characters', () => {
    const verifyButton = fixture.nativeElement.querySelector('#verifyButton');
    component.fillTestData();
    fixture.detectChanges();
    expect(component.gName.valid).toBeTrue();
    expect(component.form.valid).toBeTrue();
    expect(verifyButton.disabled).toBeFalse();

    component.gName.setValue(123);
    fixture.detectChanges();
    expect(component.gName.valid).toBeFalse();
    expect(component.form.valid).toBeFalse();
    expect(verifyButton.disabled).toBeTrue();

    component.gName.setValue('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    fixture.detectChanges();
    expect(component.gName.valid).toBeFalse();
    expect(component.form.valid).toBeFalse();
    expect(verifyButton.disabled).toBeTrue;
  })

  it('should disable the verify Button if birthdate is not in the correct date format', () => {
    const verifyButton = fixture.nativeElement.querySelector('#verifyButton');
    component.fillTestData();
    fixture.detectChanges();
    expect(component.birthDate.valid).toBeTrue();
    expect(component.form.valid).toBeTrue();
    expect(verifyButton.disabled).toBeFalse();

    component.birthDate.setValue("5-10-1998")
    fixture.detectChanges();
    expect(component.birthDate.valid).toBeFalse();
    expect(component.form.valid).toBeFalse();
    expect(verifyButton.disabled).toBeTrue();

    component.birthDate.setValue('5/10/1998')
    fixture.detectChanges();
    expect(component.birthDate.valid).toBeFalse();
    expect(component.form.valid).toBeFalse();
    expect(verifyButton.disabled).toBeTrue();

    component.birthDate.setValue('19981005')
    fixture.detectChanges();
    expect(component.birthDate.valid).toBeTrue();
    expect(component.form.valid).toBeTrue();
    expect(verifyButton.disabled).toBeFalse();
  })

  it('should disable the verify Button if Test Date Time is not in the correct Date Time format', () => {
    const verifyButton = fixture.nativeElement.querySelector('#verifyButton');
    component.fillTestData();
    fixture.detectChanges();
    expect(component.testDateTime.valid).toBeTrue();
    expect(component.form.valid).toBeTrue();
    expect(verifyButton.disabled).toBeFalse();

    component.testDateTime.setValue(2020/12/10-15-30)
    fixture.detectChanges();
    expect(component.testDateTime.valid).toBeFalse();
    expect(component.form.valid).toBeFalse();
    expect(verifyButton.disabled).toBeTrue();

    component.testDateTime.setValue('2020/12/10-15:30')
    fixture.detectChanges();
    expect(component.testDateTime.valid).toBeFalse();
    expect(component.form.valid).toBeFalse();
    expect(verifyButton.disabled).toBeTrue();

    component.testDateTime.setValue("202007011030")
    fixture.detectChanges();
    expect(component.testDateTime.valid).toBeTrue();
    expect(component.form.valid).toBeTrue();
    expect(verifyButton.disabled).toBeFalse();

  })

  it('should display the success icons if the verification was successfull', () => {
    component.fillTestData();
    fixture.detectChanges();
    
    expect(component.form.value).toEqual(TestData);
    expect(VerificationServiceStub.verify(component.form.value)).toEqual(responseData);
    const responseCode = component.checkResponse(VerificationServiceStub.verify(component.form.value));
    component.handleResponse(responseCode);
    component.showSeal(responseCode, VerificationServiceStub.hash);
    
    
    fixture.detectChanges();

    expect(responseCode).toEqual(3);
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
    
    component.fillTestData();
    component.fName.setValue('Max')
    fixture.detectChanges();
    
    const responseCode = component.checkResponse(VerificationServiceStub.verify(component.form.value));
    component.handleResponse(responseCode);
    component.showSeal(responseCode, VerificationServiceStub.hash);
    
    
    fixture.detectChanges();
    expect(responseCode).toEqual(4);
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
    const error = {status: 500};
    component.handleError(error);
    fixture.detectChanges();
    expect(component.responseInfo).toEqual({
      type: 'errorT',
      header: 'Fehler',
      info: 'Es ist ein interner Server Fehler aufgetreten. Bitte versuchen sie es später erneut.'
    });
    expect(fixture.nativeElement.querySelector('#toast')).toBeTruthy();
  })

  it('should properly handle other unexpected errors', () => {
    const error = {status: 400};

    component.handleError(error);
    fixture.detectChanges();
    expect(component.responseInfo).toEqual({
      type: 'errorT',
      header: 'Fehler',
      info: 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen sie es später erneut.'
    });
    expect(fixture.nativeElement.querySelector('#toast')).toBeTruthy();
  })

  it('should properly load data from a query', () => {
    component.Url = 'http://localhost:4200/v/?f=Mustermann&g=Erika&b=19640812&p=T01000322&i=3CF75K8D0L&d=202007011030&t=PCR&r=n&s=2fe00c151cb726bb9ed7'
    component.fillFromUrl();
    fixture.detectChanges;
    expect(component.form.valid).toBeTrue();
    expect(component.fName.value).toEqual('Mustermann');
    expect(component.gName.value).toEqual('Erika');
    expect(component.birthDate.value).toEqual('19640812');
    expect(component.idNumber.value).toEqual('T01000322');
    expect(component.labId.value).toEqual('3CF75K8D0L');
    expect(component.testDateTime.value).toEqual('202007011030');
    expect(component.testType.value).toEqual('PCR');
    expect(component.testResult.value).toEqual('n');
    expect(component.ranNum.value).toEqual('2fe00c151cb726bb9ed7');
  })

  it('should properly load data from a fragment', () => {
    component.Url = 'http://localhost:4200/v/#f=Mustermann;g=Erika;b=19640812;p=T01000322;i=3CF75K8D0L;d=202007011030;t=PCR;r=n;s=2fe00c151cb726bb9ed7'
    component.fillFromUrl();
    fixture.detectChanges;
    expect(component.form.valid).toBeTrue();
    expect(component.fName.value).toEqual('Mustermann');
    expect(component.gName.value).toEqual('Erika');
    expect(component.birthDate.value).toEqual('19640812');
    expect(component.idNumber.value).toEqual('T01000322');
    expect(component.labId.value).toEqual('3CF75K8D0L');
    expect(component.testDateTime.value).toEqual('202007011030');
    expect(component.testType.value).toEqual('PCR');
    expect(component.testResult.value).toEqual('n');
    expect(component.ranNum.value).toEqual('2fe00c151cb726bb9ed7');
  })

  it('should be an empty form without params', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);
    expect(component.fName.value).toEqual(null);
    expect(component.gName.value).toEqual(null);
    expect(component.birthDate.value).toEqual(null);
    expect(component.idNumber.value).toEqual(null);
    expect(component.labId.value).toEqual(null);
    expect(component.testDateTime.value).toEqual(null);
    expect(component.testType.value).toEqual(null);
    expect(component.testResult.value).toEqual(null);
    expect(component.ranNum.value).toEqual(null);
  })
  
});
