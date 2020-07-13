import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  defaultForm: FormGroup;
  singleControl: FormControl;

  constructor(private formBuilder: FormBuilder) {
    this.defaultForm = this.formBuilder.group({
      required: ['', Validators.required],
      min: ['', [Validators.min(10)]],
      max: ['', [Validators.max(20)]],
      minLength: ['', [Validators.minLength]],
      maxLength: ['', [Validators.maxLength]],
    });

    this.singleControl = this.formBuilder.control('');
  }
}
