import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  defaultForm: FormGroup;
  formGroup: FormGroup;
  singleControl: FormControl;

  constructor(private formBuilder: FormBuilder) {
    this.defaultForm = this.formBuilder.group({
      required: ['', [Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      min: ['', Validators.min(10)],
      max: ['', Validators.max(20)],
      minLength: ['', Validators.minLength(5)],
      maxLength: ['', Validators.maxLength(5)],
      pattern: ['', Validators.pattern('^[0-9]*$')],
    });

    this.formGroup = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', Validators.required],
    });

    this.singleControl = this.formBuilder.control('');
  }
}
