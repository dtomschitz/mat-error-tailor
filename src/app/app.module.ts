import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    MatDividerModule,
    MatErrorTailorModule.forRoot({
      defaultErrors: {
        errors: [
          {
            type: 'required',
            message: 'This field is required!',
          },
          {
            type: 'min',
            message: (error) => `The value cannot be lower than ${error.min}! You entered: ${error.actual}`,
          },
          {
            type: 'max',
            message: (error) => `The value cannot be heigher than ${error.max}! You entered: ${error.actual}`,
          },
        ],
        
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
