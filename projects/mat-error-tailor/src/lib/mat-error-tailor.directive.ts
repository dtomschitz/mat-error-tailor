import {
  Directive,
  Optional,
  OnInit,
  OnDestroy,
  ElementRef,
  Input,
  Host,
  Inject,
  Self,
  Renderer2,
} from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, NgControl } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Subject, merge, Observable, EMPTY, fromEvent } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { MatErrorTailorConfig, FormError, FormGroupErrors, FormControlErrors, SortBy } from './types';
import { MatErrorTrailorConfigProvider } from './providers';

@Directive({ selector: '[matErrorGroupName]' })
export class ErrorGroupNameDirective {
  @Input('matErrorGroupName') groupName: string;
}

@Directive({ selector: '[matErrorControlName]' })
export class ErrorControlNameDirective {
  @Input('matErrorControlName') controlName: string;
}

@Directive({
  selector: 'mat-error[matErrorTailor]',
})
export class MatErrorTailorDirective implements OnInit, OnDestroy {
  @Input() controlErrorsOnAsync = true;
  @Input() controlErrorsOnBlur = true;
  @Input() controlErrorsOnChange = true;

  private readonly destroy$: Subject<void> = new Subject<void>();

  private ngControl: NgControl;
  private groupName: string;
  private controlName: string;

  constructor(
    private renderer: Renderer2,
    private matErrorElementRef: ElementRef,
    @Inject(MatErrorTrailorConfigProvider) private config: MatErrorTailorConfig,
    @Optional() @Host() private matFormField: MatFormField,
    @Optional() @Host() private errorGoupNameDirective: ErrorGroupNameDirective,
    @Optional() @Self() private errorControlNameDirective: ErrorControlNameDirective
  ) {}

  ngOnInit() {
    this.ngControl = this.matFormField._control.ngControl;

    if (!this.config.defaultErrors && !this.config.controlErrors && !this.config.groupErrors) {
      // TODO: throw warning
      console.warn('ERRORR 0');
      return;
    }

    /*if (
      this.ngControl.control.parent instanceof FormGroup &&
      (!this.errorGoupNameDirective || this.errorGoupNameDirective.groupName === '')
    ) {
      // TODO: throw warning
      console.warn('ERRORR 1');
      return;
    }*/

    if (
      this.ngControl.control.parent instanceof FormGroup &&
      (!this.errorGoupNameDirective || this.errorGoupNameDirective.groupName === '')
    ) {
      return;
    }
    this.groupName = this.errorGoupNameDirective?.groupName;

    if (
      this.ngControl instanceof FormControl &&
      !this.ngControl.parent &&
      (!this.errorControlNameDirective || this.errorControlNameDirective.controlName === '')
    ) {
      // TODO: throw warning
      console.warn('ERRORR 2');
      return;
    }
    this.controlName = this.errorControlNameDirective?.controlName ?? this.ngControl.name.toString();


    const statusChanges$ = this.ngControl.statusChanges.pipe(takeUntil(this.destroy$));
    const valueChanges$ = this.ngControl.valueChanges;
    let errorsOnAsync$: Observable<any> = EMPTY;
    let errorsOnBlur$: Observable<any> = EMPTY;
    let errorsOnChange$: Observable<any> = EMPTY;

    const hasAsyncValidator = !!this.ngControl.asyncValidator;
    if (this.controlErrorsOnAsync && hasAsyncValidator) {
      errorsOnAsync$ = statusChanges$.pipe(startWith(true));
    }

    if (this.controlErrorsOnBlur) {
      errorsOnBlur$ = fromEvent(this.matFormField._elementRef.nativeElement, 'focusout').pipe(
        switchMap(() => valueChanges$.pipe(startWith(true)))
      );
    }

    if (this.controlErrorsOnChange) {
      errorsOnChange$ = valueChanges$;
    }

    merge(errorsOnAsync$, errorsOnBlur$, errorsOnChange$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const controlErrors = this.ngControl.errors;
        if (controlErrors) {
          const message = this.getErrorMessage(this.groupName, this.controlName, controlErrors);
          if (message) {
            this.setError(message);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setError(message: string) {
    this.renderer.setProperty(this.matErrorElementRef.nativeElement, 'innerText', message);
  }

  private getErrorMessage(
    groupName: string | undefined,
    controlName: string | undefined,
    controlErrors: ValidationErrors
  ): string {
    let error = this.getDefaultError(controlErrors);

    let groupOrControlError: FormError;
    if (groupName && controlName) {
      groupOrControlError = this.getGroupError(groupName, controlName, controlErrors);
    }

    if (!groupName && controlName) {
      groupOrControlError = this.getControlError(controlName, controlErrors);
    }

    if (groupOrControlError) {
      error = groupOrControlError;
    }

    if (error) {
      if (typeof error.message === 'function') {
        return error.message(controlErrors[error.type]);
      }
      return error.message;
    }
  }

  private getDefaultError(validationErrors: ValidationErrors): FormError {
    return this.getError(this.config.defaultErrors.errors, validationErrors, this.config.defaultErrors.sortBy);
  }

  private getGroupError(groupName: string, controlName: string, validationErrors: ValidationErrors): FormError {
    const control = this.findNestedFormControlErrors(groupName, controlName);
    if (control) {
      return this.getError(control.errors, validationErrors, control.sortBy);
    }
  }

  private getControlError(controlName: string, validationErrors: ValidationErrors): FormError {
    const control = this.findFormControlErrors(controlName);
    if (control) {
      return this.getError(control.errors, validationErrors, control.sortBy);
    }
  }

  private getError(formErrors: FormError[], validationErrors: ValidationErrors, sortBy?: SortBy): FormError {
    let errors = this.filterErrors(formErrors, validationErrors);
    if (sortBy) {
      errors = this.sortErrors(errors, sortBy);
    }
    return errors[0] || undefined;
  }

  private findFormControlErrors(controlName: string): FormControlErrors {
    return this.config?.controlErrors.find(this.nameMatch(controlName));
  }

  private findNestedFormControlErrors(groupName: string, controlName: string): FormControlErrors {
    return this.config?.groupErrors?.find(this.nameMatch(groupName))?.controls.find(this.nameMatch(controlName));
  }

  private nameMatch(name: string) {
    return (value: FormGroupErrors | FormControlErrors): boolean => {
      if (Array.isArray(value.match)) {
        return value.match.includes(name);
      }

      return value.match === name;
    };
  }

  private filterErrors(errors: FormError[], validationErrors: ValidationErrors) {
    return errors.filter((error) => validationErrors[error.type] !== undefined);
  }

  private sortErrors(errors: FormError[], sortBy: SortBy): FormError[] {
    if (typeof sortBy === 'function') {
      return errors.sort(sortBy);
    }

    return errors.sort((a, b) => {
      if (a.priority && b.priority) {
        return b.priority - a.priority;
      }
      return -1;
    });
  }
}
