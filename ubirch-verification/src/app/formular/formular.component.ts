import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VerificationService} from '../verification.service';
import {
  IResponseInfo,
  IUbirchAnchor, IUbirchAnchorObject,
  IUbirchAnchorProperties,
  IUbirchblockchain,
  IUbirchBlockchainNet,
  IUbirchResponse, IUbirchSeal
} from '../models';
import {VerificationStates} from '../verification-states.enum';
import BlockchainSettings from '../../assets/blockchain-settings.json';

@Component({
  selector: 'app-formular',
  templateUrl: './formular.component.html',
  styleUrls: ['./formular.component.css'],
  providers: [VerificationService]
})
export class FormularComponent implements OnInit {

  form: FormGroup;
  responseInfo: IResponseInfo;
  assetUrlPrefix = 'https://console.dev.ubirch.com/libs/verification/';
  consoleVerifyUrl = 'https://console.prod.ubirch.com/verification';
  seal: IUbirchSeal = {};
  anchors = [];



  constructor(private formbuilder: FormBuilder, private verificationService: VerificationService) {
  }

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

  get fName() {
    return this.form.get('f');
  }

  get gName() {
    return this.form.get('g');
  }

  get birthDate() {
    return this.form.get('b');
  }

  get idNumber() {
    return this.form.get('p');
  }

  get labId() {
    return this.form.get('i');
  }

  get testDateTime() {
    return this.form.get('d');
  }

  get testType() {
    return this.form.get('t');
  }

  get testResult() {
    return this.form.get('r');
  }

  get ranNum() {
    return this.form.get('s');
  }

  verifyClick(): void {
    this.anchors = [];
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
    console.log(seal);

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
    blockchainTX.forEach((item, index) => {
      if (!item || !item.properties) {
        return;
      }else{
        console.log('pre show anchors: ' + this.anchors);
        this.showBloxTXIcon(item.properties, index);
        console.log('post show anchors: ' + this.anchors);
      }
    });

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

  showSeal(responseCode, hash: string) {

    if (responseCode === VerificationStates.Verification_successful) {
      this.seal.src = this.assetUrlPrefix + 'ubirch_verify_right.png';

      const encodedHash: string = encodeURIComponent(hash);
      this.seal.href = this.consoleVerifyUrl + encodedHash;
    } else {
      this.seal.src = this.assetUrlPrefix + 'ubirch_verify_wrong.png';
    }
  }

  showBloxTXIcon(bloxTX: IUbirchAnchorProperties, index: number): void {
    console.log('bloxTX = ' +  bloxTX);
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
    const anchor: IUbirchAnchorObject = {};

    if (bloxTXData.url) {
      anchor.href = bloxTXData.url.toString() + bloxTX.txid;
    }

    const titleStr: string = bloxTX.network_info ? bloxTX.network_info : bloxTX.blockchain;

    anchor.title = titleStr;
    anchor.target = '_blanc';

    if (blox.nodeIcon) {
      console.log('nodeIcon = ' + blox.nodeIcon);
      anchor.icon = this.assetUrlPrefix + blox.nodeIcon.split('/')[2];
    }
    this.anchors.push(anchor);
 }
}
