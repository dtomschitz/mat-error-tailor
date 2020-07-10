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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.singleControl = this.formBuilder.control('');
  }
}
