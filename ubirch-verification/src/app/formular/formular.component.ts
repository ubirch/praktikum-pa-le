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

    this.seal = {href: '', src: ''};
    if(window.location.href.includes('?')){
      this.fillFromQuery()
    }
    
    if(window.location.href.includes('#')){
      this.fillFromFragment()
    }
    
  }

  verifyClick(): void {
    this.verificationService.verify(this.form.value).subscribe(
      response => {
        const responseCode = this.checkResponse(response.body);
        this.handleResponse(responseCode);
        this.showSeal(responseCode, this.verificationService.hash);
        console.log('verification finished');
      },
      error => {
        const responseCode = this.handleError(error);
        this.showSeal(responseCode, this.verificationService.hash);
      }
    );
  }

  checkResponse(response: IUbirchResponse): number {
    console.log('response ' + response);
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
    console.log('seal ' + seal);

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
        console.log('pre show anchors: ' + this.anchors);
        this.showBloxTXIcon(item.properties);
        console.log('post show anchors: ' + this.anchors);
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
        info: 'Es konnte kein Zertifikat gefunden werden'
      };
      return VerificationStates.Zertificate_not_found;
    } else {
      this.responseInfo = {
        type: 'error',
        header: 'Fehler',
        info: 'Es ist ein unerwarteter Fehler aufgetreten'
      };
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
    console.log('bloxTX = ' + bloxTX);
    if (!bloxTX) {
      return;
    }

    const blockchain: string = bloxTX.blockchain;
    console.log('blockchain = ' + blockchain);
    const networkType: string = bloxTX.network_type;
    console.log('networktype = ' + networkType);

    if (!blockchain || !networkType) {
      return;
    }

    const blox: IUbirchblockchain = BlockchainSettings[blockchain];
    console.log('blox = ' + blox);

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
      console.log('nodeIcon = ' + blox.nodeIcon);
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

  fillFromQuery(): void {
    const Url = window.location.href;
    let query = Url.split('?')[1].split('&');
    let UrlData = [];
    let fillData: IUbirchVerificationFormData
    
    for(let i in query){
      let item = query[i].split('=');
      console.log(item);
      UrlData.push(item[1]);
    }
    console.log(UrlData);
    
    this.fName.setValue(UrlData[0]);
    this.gName.setValue(UrlData[1]);
    this.birthDate.setValue(UrlData[2]);
    this.idNumber.setValue(UrlData[3]);
    this.labId.setValue(UrlData[4]);
    this.testDateTime.setValue(UrlData[5]);
    this.testType.setValue(UrlData[6]);
    this.testResult.setValue(UrlData[7]);
    this.ranNum.setValue(UrlData[8]);
  }

  fillFromFragment(): void {
    const Url = window.location.href;
    console.log(Url)
    let query = Url.split('#')[1].split(';');
    let UrlData = [];
    let fillData: IUbirchVerificationFormData
    
    for(let i in query){
      let item = query[i].split('=');
      console.log(item);
      UrlData.push(item[1]);
    }
    console.log(UrlData);
    
    this.fName.setValue(UrlData[0]);
    this.gName.setValue(UrlData[1]);
    this.birthDate.setValue(UrlData[2]);
    this.idNumber.setValue(UrlData[3]);
    this.labId.setValue(UrlData[4]);
    this.testDateTime.setValue(UrlData[5]);
    this.testType.setValue(UrlData[6]);
    this.testResult.setValue(UrlData[7]);
    this.ranNum.setValue(UrlData[8]);
  }
}
