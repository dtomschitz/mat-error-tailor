## Installation

npm install mat-error-tailor --save

## Usage

```typescript
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatErrorTailorModule } from 'mat-error-tailor';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatErrorTailorModule.forRoot({
      defaultErrors: {
        required: 'This field is required!',
        min: (error) => `The value cannot be lower than ${error.min}! You entered: ${error.actual}`,
        max: (error) => `The value cannot be heigher than ${error.max}! You entered: ${error.actual}`,
      },
      groupErrors: [
        {
          selector: 'formGroup',
          controls: [
            {
              selector: ['firstName', 'lastName'],
              errors: {
                pattern: 'Only characters are allowed!',
              },
            },
          ],
        },
      ],
      controlErrors: [
        {
          selector: 'singleControl',
          errors: {
            required: 'Custom required message',
          },
        },
      ],
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```html
<h2>Default Form Errors</h2>
<mat-divider></mat-divider>
<form class="form-group" [formGroup]="defaultForm" matErrorGroupName="defaultForm" autocomplete="off">
  <mat-form-field>
    <mat-label>Validators.required</mat-label>
    <input formControlName="required" matInput>
    <mat-error matErrorTailor></mat-error>
  </mat-form-field>
  <mat-form-field>
    <mat-label>Validators.min(10)</mat-label>
    <input formControlName="min" matInput>
    <mat-error matErrorTailor></mat-error>
  </mat-form-field>
  <mat-form-field>
    <mat-label>Validators.max(20)</mat-label>
    <input formControlName="max" matInput>
    <mat-error matErrorTailor></mat-error>
  </mat-form-field>
  <mat-form-field>
    <mat-label>Validators.minLength(5)</mat-label>
    <input formControlName="minLength" matInput>
    <mat-error matErrorTailor></mat-error>
  </mat-form-field>
  <mat-form-field>
    <mat-label>Validators.maxLength(5)</mat-label>
    <input formControlName="maxLength" matInput>
    <mat-error matErrorTailor matErrorControlName="dAD"></mat-error>
  </mat-form-field>
  <mat-form-field>
    <mat-label>Validators.pattern('^[0-9]*$')</mat-label>
    <input formControlName="pattern" matInput>
    <mat-error matErrorTailor></mat-error>
  </mat-form-field>
</form>

<h2>Form Group Errors</h2>
<form class="form-group" [formGroup]="formGroup" matErrorGroupName="formGroup" autocomplete="off">
  <mat-form-field>
    <mat-label>Validators.required, Validators.pattern('[a-zA-Z ]*')</mat-label>
    <input formControlName="firstName" matInput>
    <mat-error matErrorTailor></mat-error>
  </mat-form-field>
  <mat-form-field>
    <mat-label>Validators.required, Validators.pattern('[a-zA-Z ]*')</mat-label>
    <input formControlName="lastName" matInput>
    <mat-error matErrorTailor></mat-error>
  </mat-form-field>
</form>

<h2>Single Control</h2>
<div class="form-group">
  <mat-form-field>
    <mat-label>Single Control</mat-label>
    <input [formControl]="singleControl" matInput>
    <mat-error matErrorTailor matErrorControlName="singleControddl"></mat-error>
  </mat-form-field>
</div>
```

```typescript
export class AppComponent {
  defaultForm: FormGroup;
  formGroup: FormGroup;
  singleControl: FormControl;

  constructor(private formBuilder: FormBuilder) {
    this.defaultForm = this.formBuilder.group({
      required: ['', Validators.required],
      min: ['', Validators.min(10)],
      max: ['', Validators.max(20)],
      minLength: ['', Validators.minLength(5)],
      maxLength: ['', Validators.maxLength(5)],
      pattern: ['', Validators.pattern('^[0-9]*$')],
    });

    this.formGroup = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      lastName: ['', Validators.required, Validators.pattern('[a-zA-Z ]*')],
    });

    this.singleControl = this.formBuilder.control('', [Validators.required]);
  }
}

```
