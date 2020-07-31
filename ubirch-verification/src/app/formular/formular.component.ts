import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-formular',
  templateUrl: './formular.component.html',
  styleUrls: ['./formular.component.css']
})
export class FormularComponent implements OnInit {

  form: FormGroup;
  birthDate: any;

  constructor(private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      fName: [null, Validators.required],
      gName: [null, Validators.required],
      birthDate: [null, Validators.required],
      idNumber: [null, Validators.required],
      labId: [null, Validators.required],
      testDateTime: [null, Validators.required],
      testType: [null, Validators.required],
      testResult: [null, [Validators.required, Validators.pattern('x|n|p')]],
      ranNum: [null, Validators.required]
    });
  }

  onClickVerify(): void{
    console.log(this.birthDate);
  }

}
