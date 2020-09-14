import { Component, OnInit } from '@angular/core';
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
import VerificationConfig from '../../assets/Verification-comfig.json';
import TestData from '../../assets/test-data.json'
import BlockchainSettings from '../../assets/blockchain-settings.json';
import { ResponseDataService } from '../services/response-data.service';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  responseInfo: IResponseInfo;
  seal: IUbirchSeal;
  anchors = [];
  bloxTX
  Url: string;
  showToast: boolean = false;
  responseCode: number;
  error: any;
  hash: string;

  constructor(private ressponseService: ResponseDataService) { }

  ngOnInit(): void {
    this.anchors = [];
    this.ressponseService.currentResponseCode.subscribe(responseCode => this.responseCode = responseCode);
    this.ressponseService.currentAnchors.subscribe(anchors => this.bloxTX = anchors);
    this.ressponseService.currentError.subscribe(error => this.error = error);
    this.ressponseService.currentHash.subscribe(hash => this.hash = hash);

    this.handleResponse(this.responseCode);
    this.showSeal(this.responseCode, this.hash);
    this.showBloxTXIcon(this.bloxTX)
    
  }

  showSeal(responseCode, hash: string): void {
    this.seal = {src:'', href: ''}

    if (responseCode === VerificationStates.Verification_successful) {
      this.seal.src = VerificationConfig.assets_url_prefix + VerificationConfig.seal_icon_url;

      const encodedHash: string = encodeURIComponent(hash);
      this.seal.href = VerificationConfig.console_verify_url + encodedHash;
    } else {
      this.seal.src = VerificationConfig.assets_url_prefix + VerificationConfig.no_seal_icon_url;
    }
  }

  toastTimeout(){
    this.showToast = true;
    setTimeout(function() { 
      this.showToast = false;
  }.bind(this), 5000);
  }

  showBloxTXIcon(bloxTX: any): void {
    if (!bloxTX) {
      return;
    }

    bloxTX.forEach((item) => {
      if (!item || !item.properties) {
        return;
      } else {
        const blockchain: string = item.properties.blockchain;
   
        const networkType: string = item.properties.network_type;
    

        if (!blockchain || !networkType) {
           return;
        }

        const blox: IUbirchblockchain = BlockchainSettings[blockchain];   

        if (!blox) {
          return;
        }

        const bloxTXData: IUbirchBlockchainNet = blox.explorerUrl[networkType];
        const anchor: IUbirchAnchorObject = {href: undefined, icon: '', target: '', title: ''};

        if (bloxTXData.url) {
          anchor.href = bloxTXData.url.toString() + item.properties.txid;
        }

        anchor.title = bloxTX.network_info ? bloxTX.network_info : bloxTX.blockchain;
        anchor.target = '_blanc';

        if (blox.nodeIcon) {
          anchor.icon = VerificationConfig.assets_url_prefix + blox.nodeIcon.split('/')[2];
        }
        this.anchors.push(anchor);
      }
    });   
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
        break;
      }
      case VerificationStates.Zertificate_not_found: {
        this.responseInfo = {
          type: 'error',
          header: 'Verifikation fehlgeschlagen',
          info: 'Es konnte kein Zertifikat gefunden werden.'
        };
        this.toastTimeout();
        break;
      }
      case VerificationStates.Internal_Error: {
        this.responseInfo = {
          type: 'errorT',
          header: 'Fehler',
          info: 'Es ist ein interner Server Fehler aufgetreten. Bitte versuchen sie es später erneut.'
        };
        this.toastTimeout();
        break;
      }
      case VerificationStates.Unknown_Error: {
        this.responseInfo = {
          type: 'errorT',
          header: 'Fehler',
          info: 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen sie es später erneut.'
        };
        this.toastTimeout();
        break;
      }
    }
  }

}
