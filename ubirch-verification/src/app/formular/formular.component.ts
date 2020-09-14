import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VerificationService} from '../services/verification.service';
import {FillDataService} from '../services/fill-data.service'
import {
  IResponseInfo,
  IUbirchResponse,
  IUbirchSeal
} from '../models';
import {VerificationStates} from '../verification-states.enum';
import TestData from '../../assets/test-data.json'
import { ActivatedRoute } from '@angular/router';
import { ResponseDataService } from '../services/response-data.service';
import { Hash } from 'crypto';

@Component({
  selector: 'app-formular',
  templateUrl: './formular.component.html',
  styleUrls: ['./formular.component.css'],
})
export class FormularComponent implements OnInit {

  form: FormGroup;
  responseInfo: IResponseInfo;
  seal: IUbirchSeal;
  anchors = [];
  showToast: boolean = false;
  responseCode: number;
  hash: string;
  error: any;
  testData = TestData;
  


  constructor(private formbuilder: FormBuilder, private verificationService: VerificationService, private route: ActivatedRoute, private responseService: ResponseDataService, private fillData: FillDataService ) {
  }

  get fName(): AbstractControl {
    return this.form.get('f');
  }

  get gName(): AbstractControl {
    return this.form.get('g');
  }

  get birthDate(): AbstractControl {
    return this.form.get('b');
  }

  get idNumber(): AbstractControl {
    return this.form.get('p');
  }

  get labId(): AbstractControl {
    return this.form.get('i');
  }

  get testDateTime(): AbstractControl {
    return this.form.get('d');
  }

  get testType(): AbstractControl {
    return this.form.get('t');
  }

  get testResult(): AbstractControl{
    return this.form.get('r');
  }

  get ranNum(): AbstractControl {
    return this.form.get('s');
  }

  ngOnInit(): void {
    
    this.form = this.formbuilder.group({
      b: [null, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(8), Validators.minLength(8)]],
      d: [null, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(12), Validators.minLength(12)]],
      f: [null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/), Validators.maxLength(50)]],
      g: [null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/), Validators.maxLength(50)]],
      i: [null, Validators.required],
      p: [null, [Validators.required, Validators.maxLength(9)]],
      r: [null, [Validators.required, Validators.pattern('x|n|p')]],
      s: [null, Validators.required],
      t: [null, Validators.required]
    });

    this.responseService.currentResponseCode.subscribe(responseCode => this.responseCode = responseCode);
    this.responseService.currentError.subscribe(error => this.error = error);
    this.responseService.currentHash.subscribe(hash => this.hash = hash);

    this.route.queryParams.subscribe(params => {
      if(params){
        this.fillFromData(params)
      }
    })
    this.getFragment();
  }

  verifyClick(): void {
    this.anchors = [];
    this.responseService.changeResponseCode(null);
    const response = this.verificationService.verify(this.form.value)
    this.responseService.getResponse(response);
  }

  fillFromData(data): void {
    this.fName.setValue(data.f);
    this.gName.setValue(data.g);
    this.idNumber.setValue(data.p);
    this.ranNum.setValue(data.s);
    this.testDateTime.setValue(data.d);
    this.testResult.setValue(data.r);
    this.testType.setValue(data.t);
    this.birthDate.setValue(data.b);
    this.labId.setValue(data.i);
  }
  
  getFragment() {
    const separator =  ';';
    const params = window.location.hash.slice(1).split(separator).map((value: string) => {
      const data = value.split('=');
      return {
        key: data[0],
        value: data[1]
      };
    });
      
     if(params[0].key && params[0].value){
      params.forEach(element => {
        const idIndex = this.form.get(element.key)
        idIndex.setValue(element.value);
      });
     }
  }
}
