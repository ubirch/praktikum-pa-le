import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-formular',
  templateUrl: './formular.component.html',
  styleUrls: ['./formular.component.css']
})
export class FormularComponent implements OnInit {

  form: FormGroup;
  formData: any;

  constructor(private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      fName: ['Mustermann', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      gName: ['Erika', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      birthDate: [19640812, Validators.required],
      idNumber: ['T01000322', Validators.required],
      labId: ['3CF75K8D0L', Validators.required],
      testDateTime: [202007011030, Validators.required],
      testType: ['PCR', Validators.required],
      testResult: ['n', [Validators.required, Validators.pattern('x|n|p')]],
      ranNum: ['2fe00c151cb726bb9ed7', Validators.required]
    });
  }

  get fName() { return this.form.get('fName'); }
  get gName() { return this.form.get('gName'); }
  get birthDate() { return this.form.get('birthDate'); }
  get idNumber() { return this.form.get('idNumber'); }
  get labId() { return this.form.get('labId'); }
  get testDateTime() { return this.form.get('testDateTime'); }
  get testType() { return this.form.get('testType'); }
  get testResult() { return this.form.get('testResult'); }
  get ranNum() { return this.form.get('ranNum'); }

  createJson(){
   this.formData = JSON.stringify({
      b: this.birthDate.value,
      d: this.testDateTime.value,
      f: this.fName.value,
      g: this.gName.value,
      i: this.labId.value,
      p: this.idNumber.value,
      r: this.testResult.value,
      s: this.ranNum.value,
      t: this.testType.value,
    });
  }
}
