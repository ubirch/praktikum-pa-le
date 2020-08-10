import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256/src/sha256.js';
import { sha512} from 'js-sha512';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {IUbirchResponse} from './models';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {

  verificationApiUrl = 'https://verify.prod.ubirch.com/api/upp/verify/anchor?blockchain_info=ext';
  verificationStatus: any;

  constructor(private http: HttpClient) { }

  verify(fData): void {
    const json = this.createJson(fData);
    const hash = this.createHash(json);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain'
      }),
    };
    this.http.post(this.verificationApiUrl, hash, {observe: 'response'})
      .pipe(catchError(this.handleError))
      .subscribe(response => {
        console.log(response.body);
        this.checkResponse(response.body, hash);
      });
  }

  createJson(formData): string {
     console.log(formData);
     const json = JSON.stringify(formData);
     console.log('json:' + json);
     return json;
  }

  createHash(json): string {
    let transIdAB: ArrayBuffer;
    transIdAB = sha256.arrayBuffer(json);
    const transId: string = btoa(new Uint8Array(transIdAB).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    console.log('hash: ' + transId);
    return transId;
  }



  sendVerificationRequest(hash: string): void {


  }

  handleError(error: HttpErrorResponse){
   if (error.status === 404){
     this.verificationStatus = {type: error, code: 1};
     return throwError(
       this.verificationStatus = {type: error, code: 1}
     );
   }else {
     this.verificationStatus = {type: error, code: 4};
     return throwError(
       'Ein unbekannter Fehler ist aufgetreten; server response code:' + error.status);
   }

  }

  checkResponse(response: object, hash: string){
    if (!response){
      // error 'Verification failed empty response'
      this.verificationStatus = {type: 'error', code: 3};
    }

    const responseObj: IUbirchResponse = response;

    if (!responseObj){
      // error 'Verification failed empty response'
      this.verificationStatus = {type: 'error', code: 3};
    }

    const seal = responseObj.upp;
    console.log(seal);

    if (!seal || !seal.length){
      // error 'Verification failed missing seal in response'
      this.verificationStatus = {type: 'error', code: 2};
    }

    // verification successful
    console.log('verification successful');
    this.verificationStatus = {type: 'info', code: 2};

    const blockchainTX = responseObj.anchors;
    console.log(blockchainTX);

    if (!blockchainTX || !blockchainTX.length){
      // error 'no anchors'
      this.verificationStatus = {type: 'error', code: 4};
    }

    // success
  }


}
