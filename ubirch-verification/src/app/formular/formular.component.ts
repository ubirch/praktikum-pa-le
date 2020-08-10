import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VerificationService} from '../verification.service';
import {IUbirchResponse} from "../models";
import {calcPossibleSecurityContexts} from "@angular/compiler/src/template_parser/binding_parser";

@Component({
  selector: 'app-formular',
  templateUrl: './formular.component.html',
  styleUrls: ['./formular.component.css'],
  providers: [VerificationService]
})
export class FormularComponent implements OnInit {

  form: FormGroup;
  response: any;

  constructor(private formbuilder: FormBuilder, private verificationService: VerificationService) { }

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      b: ['19640812', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      d: ['202007011030', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      f: ['Mustermann', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      g: ['Erika', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      i: ['3CF75K8D0L', Validators.required],
      p: ['T01000322', Validators.required],
      r: ['n', [Validators.required, Validators.pattern('x|n|p')]],
      s: ['2fe00c151cb726bb9ed7', Validators.required],
      t: ['PCR', Validators.required]
    });
  }

  get fName() { return this.form.get('f'); }
  get gName() { return this.form.get('g'); }
  get birthDate() { return this.form.get('b'); }
  get idNumber() { return this.form.get('p'); }
  get labId() { return this.form.get('i'); }
  get testDateTime() { return this.form.get('d'); }
  get testType() { return this.form.get('t'); }
  get testResult() { return this.form.get('r'); }
  get ranNum() { return this.form.get('s'); }

  verifyClick(): void {
    this.verificationService.verify(this.form.value).subscribe(
      response => {
        const responseObj = this.checkResponse(response.body);
        this.handleResponse(responseObj);
      },
      error => {
          this.handleError(error);
        }

    );
  }

  checkResponse(response: object){
    if (!response){
      // error 'Verification failed empty response'
      return {code: 1};
    }

    const responseObj: IUbirchResponse = response;

    if (!responseObj){
      // error 'Verification failed empty response'
      return {code: 1};
    }

    const seal = responseObj.upp;
    console.log(seal);

    if (!seal || !seal.length){
      // error 'Verification failed missing seal in response'
      return {code: 2};
    }

    // verification successful
    return {code: 0};

    const blockchainTX = responseObj.anchors;

    if (!blockchainTX || !blockchainTX.length){
      // error 'no anchors'
      return {code: 3};
    }
  }

  handleResponse(responseObj) {
   switch (responseObj.code){
     case 0: {
       this.response = {type: 'success', header: 'Verifikation erfolgreich', info: 'Die Verifikation Ihres tests war erfolgreich'};
       break;
     }
     case 1: {
       this.response = {type: 'error', header: 'Verifikation fehlgeschlagen', info: 'Verification failed empty response'};
       break;
     }
     case 2: {
       this.response = {type: 'error', header: 'Verifikation fehlgeschlagen', info: 'Verification failed, missing seal'};
       break;
     }
     case 3: {
       this.response = {type: 'error', header: 'Fehlende Verankerungen', info: 'Es gibt keine Blockchain-Verankerungen'};
     }
   }
  }

  handleError(error){
    if (error.status === 404){
      this.response = {type: 'error', header: 'Verifikation fehlgeschlagen', info: 'Es konnte kein Zertifikat gefunden werden'}
    }else{
      this.response = {type: 'error', header: 'Es ist ein unerwarteter Fehler aufgetreten'};
    }

  }
}
