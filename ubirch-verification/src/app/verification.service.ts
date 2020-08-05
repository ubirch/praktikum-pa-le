import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256/src/sha256.js';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {

  constructor(private http: HttpClient) { }

  verify(fData): void {
    const json = this.createJson(fData);
    const hash = this.createHash(json);
    this.verifyHash(hash);
  }

  createJson(formData): string {
     console.log(formData);
     const json = JSON.stringify(formData);
     console.log(json);
     return json;
  }

  createHash(json): string {
    let transIdAB: ArrayBuffer;
    transIdAB = sha256.arrayBuffer(json);
    const transId: string = btoa(new Uint8Array(transIdAB).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    console.log('jsonhash: ' + transId);
    return transId;
  }

  verifyHash(hash){
    this.sendverificationRequest(hash);
  }

  sendverificationRequest(hash: string): void {

  }
}
