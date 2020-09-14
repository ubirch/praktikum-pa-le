import { async, ComponentFixture, TestBed} from '@angular/core/testing';

import { FormularComponent } from './formular.component';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, CheckboxControlValueAccessor } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VerificationService } from '../services/verification.service';
import { DateTimeComponent } from './DateTime/date-time/date-time.component';
import TestData from '../../assets/test-data.json'
import responseData from '../../assets/response-test-data.json'
import { ResponseDataService } from '../services/response-data.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('FormularComponent', () => {
  let component: FormularComponent;
  let fixture: ComponentFixture<FormularComponent>;
  let verificationService: VerificationService;
  let VerificationServiceStub: Partial<VerificationService>
  let router: RouterTestingModule
  let route: ActivatedRoute

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule.withRoutes([
        {path: 'v', component: FormularComponent},{path: '', redirectTo: 'v', pathMatch: 'full'}])],
      declarations: [ FormularComponent, DateTimeComponent ],
      providers: [{provide: DateTimeComponent}, {provide: ResponseDataService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularComponent);
    verificationService = TestBed.inject(VerificationService);
    component = fixture.componentInstance;
    router = TestBed.inject(RouterTestingModule)
    route = TestBed.inject(ActivatedRoute)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly snyc the entered Values with the Formcontrol Values', () => {
    let gName = fixture.nativeElement.querySelector('#gName');
    gName.value = 'Erika';
    gName.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(gName.value).toEqual('Erika');
    expect(component.gName.value).toEqual('Erika');

    let fName = fixture.nativeElement.querySelector('#fName');
    fName.value = 'Mustermann';
    fName.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable();
    expect(fName.value).toEqual('Mustermann');
    expect(component.fName.value).toEqual('Mustermann');

    let idNumber = fixture.nativeElement.querySelector('#idNumber');
    idNumber.value = '123456789';
    idNumber.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable();
    expect(idNumber.value).toEqual('123456789');
    expect(component.idNumber.value).toEqual('123456789');

    let ranNum = fixture.nativeElement.querySelector('#ranNum');
    ranNum.value = '123';
    ranNum.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable();
    expect(ranNum.value).toEqual('123');
    expect(component.ranNum.value).toEqual('123');

    let testResult = fixture.nativeElement.querySelector('#testResult');
    testResult.value = 'p';
    testResult.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable();
    expect(testResult.value).toEqual('p');
    expect(component.testResult.value).toEqual('p');

    let testType = fixture.nativeElement.querySelector('#testType');
    testType.value = 'PCR';
    testType.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable();
    expect(testType.value).toEqual('PCR');
    expect(component.testType.value).toEqual('PCR'); 
    
    let labId = fixture.nativeElement.querySelector('#labId');
    labId.value = 'lab1';
    labId.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable();
    expect(labId.value).toEqual('lab1');
    expect(component.labId.value).toEqual('lab1');
  })

  it('should be a valid form after test data is pasted, meaning all fields are correctly filled', ()  => {
    expect(component.form.valid).toBe(false);
    component.fillFromData(TestData);
    expect(component.form.valid).toBe(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#verifyButton').disabled).toBeFalse();
  });

  it('should disable the verify button if not all form fields are filled', () => {

    const verifyButton = fixture.nativeElement.querySelector('#verifyButton');
    expect(verifyButton.disabled).toBeTrue();
    
    //test fName
    component.fillFromData(TestData);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.fName.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    //test gName
    component.fillFromData(TestData);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.gName.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    //test idNumber
    component.fillFromData(TestData);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.idNumber.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    //test ranNum
    component.fillFromData(TestData);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.ranNum.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    // test testDateTime
    component.fillFromData(TestData);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.testDateTime.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    // test testResult
    component.fillFromData(TestData);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.testResult.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    // test testType
    component.fillFromData(TestData);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.testType.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    // test birthDate
    component.fillFromData(TestData);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.birthDate.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();

    // test labId
    component.fillFromData(TestData);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeFalse();
    component.labId.setValue(null);
    fixture.detectChanges();
    expect(verifyButton.disabled).toBeTrue();
  })

  it('should disable the verify Button if first Name is not a string or longer than 50 characters', () => {
    const verifyButton = fixture.nativeElement.querySelector('#verifyButton');
    component.fillFromData(TestData);
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
    component.fillFromData(TestData);
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
    component.fillFromData(TestData);
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
    component.fillFromData(TestData);
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

  /*it('should properly load data from a query', () => {
    const spyRoute = spyOnProperty(route, "queryParams")
    spyRoute.and.returnValue({
    b: "19640812",
    d: "202007011030",
    f: "Mustermann",
    g: "Erika",
    i: "3CF75K8D0L",
    p: "T01000322",
    r: "n",
    s: "2fe00c151cb726bb9ed7",
    t: "PCR"})
    component.ngOnInit();
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
  })*/

  /*it('should properly load data from a fragment', () => {
    component.ngOnInit();
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
  })*/

  it('should be an empty form without params', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);
    expect(component.fName.value).toEqual(undefined);
    expect(component.gName.value).toEqual(undefined);
    expect(component.birthDate.value).toEqual(undefined);
    expect(component.idNumber.value).toEqual(undefined);
    expect(component.labId.value).toEqual(undefined);
    expect(component.testDateTime.value).toEqual(undefined);
    expect(component.testType.value).toEqual(undefined);
    expect(component.testResult.value).toEqual(undefined);
    expect(component.ranNum.value).toEqual(undefined);
  })
  
});
