import { Component, OnInit } from '@angular/core';
import {ResponseDataService} from './services/response-data.service'
import { VerificationService } from './services/verification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[VerificationService]

})
export class AppComponent implements OnInit{

  responseCode: number;

  constructor(private responseService: ResponseDataService ) {
  }

  ngOnInit() {
    this.responseService.currentResponseCode.subscribe(responseCode => this.responseCode = responseCode);
  }


}
