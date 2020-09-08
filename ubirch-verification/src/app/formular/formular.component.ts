import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VerificationService} from '../verification.service';
import {
  IResponseInfo,
  IUbirchAnchorObject,
  IUbirchAnchorProperties,
  IUbirchblockchain,
  IUbirchBlockchainNet,
  IUbirchResponse,
  IUbirchSeal, IUbirchVerificationFormData
} from '../models';
import {VerificationStates} from '../verification-states.enum';
import BlockchainSettings from '../../assets/blockchain-settings.json';
import VerificationConfig from '../../assets/Verification-comfig.json';
import TestData from '../../assets/test-data.json'
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-formular',
  templateUrl: './formular.component.html',
  styleUrls: ['./formular.component.css'],
  providers: [VerificationService]
})
export class FormularComponent implements OnInit {

  form: FormGroup;
  responseInfo: IResponseInfo;
  seal: IUbirchSeal;
  anchors = [];
  Url: string;
  showToast: boolean = false;


  constructor(private formbuilder: FormBuilder, private verificationService: VerificationService) {
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
    this.responseInfo = { type: '', header: '', info: ''}
    this.seal = {href: '', src: ''};
    this.Url = window.location.href
    
   this.fillFromUrl()
    
    
  }

  verifyClick(): void {
    this.anchors = [];
    this.verificationService.verify(this.form.value).subscribe(
      response => {
        console.log(response)
        const responseCode = this.checkResponse(response.body);
        this.handleResponse(responseCode);
        this.showSeal(responseCode, this.verificationService.hash);
        console.log('verification finished');
      },
      error => {
        console.log(error);
        const responseCode = this.handleError(error);
        this.showSeal(responseCode, this.verificationService.hash);
      }
    );
  }

  checkResponse(response: IUbirchResponse): number {
    if (!response) {
      // error 'Verification failed empty response'
      return VerificationStates.Empty_Response;
    }

    const responseObj: IUbirchResponse = response;

    if (!responseObj) {
      // error 'Verification failed empty response'
      return VerificationStates.Empty_Response;
    }

    const seal = responseObj.upp;

    if (!seal || !seal.length) {
      // error 'Verification failed missing seal in response'
      return VerificationStates.No_seal_found;
    }

    const blockchainTX = responseObj.anchors;

    if (!blockchainTX || !blockchainTX.length) {
      // warning 'no anchors'
      return VerificationStates.Achors_not_found;
    }

    // verification successful
    blockchainTX.forEach((item) => {
      if (!item || !item.properties) {
        return;
      } else {
        this.showBloxTXIcon(item.properties);
      }
    });
    
    console.log('verification successfull')
    return VerificationStates.Verification_successful;
  }

  handleResponse(responseCode): void {
    switch (responseCode) {
      case VerificationStates.Verification_successful: {
        this.responseInfo = {
          type: 'success',
          header: 'Verifikation erfolgreich',
          info: 'Die Verifikation Ihres Tests war erfolgreich'
        };
        break;
      }
      case VerificationStates.Empty_Response: {
        this.responseInfo = {
          type: 'error',
          header: 'Verifikation fehlgeschlagen',
          info: 'Verification failed empty response'
        };
        break;
      }
      case VerificationStates.No_seal_found: {
        this.responseInfo = {
          type: 'error',
          header: 'Verifikation fehlgeschlagen',
          info: 'Verification failed, missing seal'
        };
        break;
      }
      case VerificationStates.Achors_not_found: {
        this.responseInfo = {
          type: 'warning',
          header: 'Fehlende Verankerungen',
          info: 'Es gibt keine Blockchain-Verankerungen'
        };
      }
    }
  }

  handleError(error): any {
    if (error.status === 404) {
      this.responseInfo = {
        type: 'error',
        header: 'Verifikation fehlgeschlagen',
        info: 'Es konnte kein Zertifikat gefunden werden.'
      };
      return VerificationStates.Zertificate_not_found;
    } else if(error.status >= 500 && error.status < 600){
      this.responseInfo = {
        type: 'errorT',
        header: 'Fehler',
        info: 'Es ist ein interner Server Fehler aufgetreten. Bitte versuchen sie es später erneut.'
      };
      this.toastTimeout();
      return VerificationStates.Internal_Error;
    } else {
      this.responseInfo = {
        type: 'errorT',
        header: 'Fehler',
        info: 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen sie es später erneut.'
      };
      this.toastTimeout();
      return VerificationStates.Unknown_Error;
    }
  }

  showSeal(responseCode, hash: string): void {

    if (responseCode === VerificationStates.Verification_successful) {
      this.seal.src = VerificationConfig.assets_url_prefix + VerificationConfig.seal_icon_url;

      const encodedHash: string = encodeURIComponent(hash);
      this.seal.href = VerificationConfig.console_verify_url + encodedHash;
    } else {
      this.seal.src = VerificationConfig.assets_url_prefix + VerificationConfig.no_seal_icon_url;
    }
  }

  showBloxTXIcon(bloxTX: IUbirchAnchorProperties): void {
    if (!bloxTX) {
      return;
    }

    const blockchain: string = bloxTX.blockchain;
   
    const networkType: string = bloxTX.network_type;
    

    if (!blockchain || !networkType) {
      return;
    }

    const blox: IUbirchblockchain = BlockchainSettings[blockchain];
   

    if (!blox || !bloxTX.txid) {
      return;
    }

    const bloxTXData: IUbirchBlockchainNet = blox.explorerUrl[networkType];
    const anchor: IUbirchAnchorObject = {href: undefined, icon: '', target: '', title: ''};

    if (bloxTXData.url) {
      anchor.href = bloxTXData.url.toString() + bloxTX.txid;
    }

    anchor.title = bloxTX.network_info ? bloxTX.network_info : bloxTX.blockchain;
    anchor.target = '_blanc';

    if (blox.nodeIcon) {
     
      anchor.icon = VerificationConfig.assets_url_prefix + blox.nodeIcon.split('/')[2];
    }
    this.anchors.push(anchor);
  }

  fillTestData(): void {
    this.fName.setValue(TestData.f);
    this.gName.setValue(TestData.g);
    this.idNumber.setValue(TestData.p);
    this.ranNum.setValue(TestData.s);
    this.testDateTime.setValue(TestData.d);
    this.testResult.setValue(TestData.r);
    this.testType.setValue(TestData.t);
    this.birthDate.setValue(TestData.b);
    this.labId.setValue(TestData.i);
  }

  fillFromUrl(): void {
    const Url = this.Url;
    let query: string[];
    let queryitems: string[] = [];
    
    if(Url.includes('/v?')){
       query = Url.split('?')[1].split('&');;
    }else if(Url.includes('/v#')){
       query = Url.split('#')[1].split(';');;
     }else{
       return;
     }  

    for(let i in query){
      let item = query[i]
      queryitems.push(item);
    }    

    for(let j in queryitems){
      let item = queryitems[j].split('=')
      switch(item[0]) {
        case 'f':{
          this.fName.setValue(item[1]);
        }
        case 'g':{
          this.gName.setValue(item[1]);
        }
        case 'b':{
          this.birthDate.setValue(item[1]);
        }
        case 'p':{
          this.idNumber.setValue(item[1]);
        }
        case 'i':{
          this.labId.setValue(item[1]);
        }
        case 'd':{
          this.testDateTime.setValue(item[1]);
        }
        case 't':{
          this.testType.setValue(item[1]);
        }
        case 'r':{
          this.testResult.setValue(item[1]);
        }
        case 's':{
          this.ranNum.setValue(item[1]);
        }
      } 
    }    
  }

  toastTimeout(){
    this.showToast = true;
    setTimeout(function() { 
      this.showToast = false;
  }.bind(this), 5000);
  }
}
