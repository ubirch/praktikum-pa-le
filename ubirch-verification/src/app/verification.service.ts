import {Injectable} from '@angular/core';
import {sha256} from 'js-sha256/src/sha256.js';
import {sha512} from 'js-sha512';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {IUbirchResponse} from './models';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {

  verificationApiUrl = 'https://verify.prod.ubirch.com/api/upp/verify/anchor?blockchain_info=ext';

  constructor(private http: HttpClient) {
  }

  verify(fData): any {
    const json = this.createJson(fData);
    const hash = this.createHash(json);
    console.log(json);
    console.log(hash);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain'
      }),
    };
    return this.http.post(this.verificationApiUrl, hash, {observe: 'response'});
  }

  createJson(formData): string {
    const json = JSON.stringify(formData);
    return json;
  }

  createHash(json): string {
    let transIdAB: ArrayBuffer;
    transIdAB = sha256.arrayBuffer(json);
    const transId: string = btoa(new Uint8Array(transIdAB).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    return transId;
  }
}
