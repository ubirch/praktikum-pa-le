import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeComponent),
      multi: true
    }
  ]
})
export class DateTimeComponent implements ControlValueAccessor {

  disabled: boolean;
  value: string;

  @Input() withTimeFlag = false;
  @Input() dateFormat: any;

  constructor() {

  }

  onChange: any = () => {
  };

  onTouched: any = () => {
  };

  writeValue(value: any) {
    this.value = value ? value : '';
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  onInput(event) {
    this.value = event.target.value;
    const year = event.target.value.slice(0, 4);
    console.log(year);
    const month = event.target.value.slice(5, 7);
    console.log(month);
    const day = event.target.value.slice(8, 10);
    console.log(day);

    if (this.withTimeFlag === true) {
      const time = event.target.value.slice(11, 13) + event.target.value.slice(14, 16);
      const data: string = year + month + day + time;
      this.onChange(data);
    } else {
      const data: string = year + month + day;
      this.onChange(data);
    }
  }
}

