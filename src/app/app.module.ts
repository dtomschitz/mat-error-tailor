import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatErrorTailorModule } from 'mat-error-tailor';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatErrorTailorModule.forRoot({
      defaultErrors: {
        required: 'This field is required!',
        min: (error) => `The value cannot be lower than ${error.min}! You entered: ${error.actual}`,
        max: (error) => `The value cannot be heigher than ${error.max}! You entered: ${error.actual}`,
        minlength: (error) =>
          `The value cannot be shorter than ${error.requiredLength}! You entered: ${error.actualLength} chars`,
        maxlength: (error) =>
          `The value cannot be longer than ${error.requiredLength}! You entered: ${error.actualLength} chars`,
        pattern: 'Only numbers are allowed!',
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

            {
              selector: 'firstName',
              errors: {
                required: 'Enter your first name',
              },
            },
            {
              selector: 'lastName',
              errors: {
                required: 'Enter your last name',
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
