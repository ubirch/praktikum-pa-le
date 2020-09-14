import { Injectable } from '@angular/core';
import { IUbirchAnchorProperties, IUbirchAnchor } from '../models';
import { BehaviorSubject } from 'rxjs';
import {
  IResponseInfo,
  IUbirchResponse,
  IUbirchSeal
} from '../models';
import {VerificationStates} from '../verification-states.enum';

@Injectable({
  providedIn: 'root'
})
export class ResponseDataService {

  private responseCodeSource = new BehaviorSubject(null);
  currentResponseCode = this.responseCodeSource.asObservable();
  
  private hashSource = new BehaviorSubject(null);
  currentHash = this.hashSource.asObservable();

  private errorSource = new BehaviorSubject(null);
  currentError = this.errorSource.asObservable();

  private anchorsSource = new BehaviorSubject(null);
  currentAnchors = this.anchorsSource.asObservable();  


  constructor() { }

  changeResponseCode(responseCode: number) {
    this.responseCodeSource.next(responseCode);
  }

  changeHash(hash: string) {
    this.hashSource.next(hash);
  }

  changeError(error: any) {
    this.errorSource.next(error);
  }

  changeAnchors(anchorProperties: IUbirchAnchor[]) {
    this.anchorsSource.next(anchorProperties);
  }

  checkResponse(response: any): number {
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
    }else{
      this.changeAnchors(blockchainTX);
    }    

    // verification successful    
    console.log('verification successfull')
    return VerificationStates.Verification_successful;
  }

  checkError(error: any): number{
    this.changeAnchors(null);
    if(error.status === 404){
      return VerificationStates.Zertificate_not_found;
    } else if(error.status >= 500 && error.status < 600){
      return VerificationStates.Internal_Error;
    }else{
      return VerificationStates.Unknown_Error;
    }
  }

  getResponse(response) {
    response.subscribe(
      response => {
        console.log(response)
        const responseCode = this.checkResponse(response.body);
        this.changeResponseCode(responseCode);
        //this.handleResponse(responseCode);
        //.showSeal(responseCode, this.verificationService.hash);
        console.log('verification finished');
      },
      error => {
        console.log(error);
        const responseCode = this.checkError(error);
        this.changeResponseCode(responseCode);
        // const responseCode = this.handleError(error);
        //.showSeal(responseCode, this.verificationService.hash);
      }
    );
  }
}
