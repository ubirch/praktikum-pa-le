import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormularComponent } from './formular/formular.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import { DateTimeComponent } from './formular/DateTime/date-time/date-time.component';
import { ResultComponent } from './result/result.component';
import { ResponseDataService } from './services/response-data.service';


@NgModule({
  declarations: [
    AppComponent,
    FormularComponent,
    DateTimeComponent,
    ResultComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
  providers: [ResponseDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
