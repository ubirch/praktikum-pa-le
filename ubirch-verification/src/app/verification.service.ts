import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256/src/sha256.js';
import { sha512} from 'js-sha512';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {

  verificationApiUrl = 'https://verify.prod.ubirch.com/api/upp/verify/anchor?blockchain_info=ext';
  verificationStatus = 0;
  constructor(private http: HttpClient) { }

  verify(fData): void {
    const json = this.createJson(fData);
    const hash = this.createHash(json);
    this.verifyHash(hash);
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

  verifyHash(hash): void{
    this.sendVerificationRequest(hash);
  }

  sendVerificationRequest(hash: string): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain'
      }),
    };
    this.http.post(this.verificationApiUrl, hash, {observe: 'response'})
      .pipe(catchError(this.handleError))
      .subscribe(response => {
        console.log(response.body);
        this.handleResponse(response.body, hash);
      });

  }

  handleError(error: HttpErrorResponse){
   if (error.status === 404){
     return throwError(
       'Zertifikat konnte nicht gefunden werden.'
     );
   }else {
     return throwError(
       'Ein unbekannter Fehler ist aufgetreten; server response code:' + error.status);
   }

  }

  handleResponse(response: object, hash: string){
    let seal = Object.entries(response)[0];
    seal = seal[1];
    console.log(seal);

    if (!seal || !seal.length){
      this.verificationStatus = 1;
    }

  }


}
