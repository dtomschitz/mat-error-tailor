export interface MatErrorTailorConfig {
  defaultErrors?: {
    errors: FormErrors;
    sortBy?: SortBy;
  };
  groupErrors?: FormGroupErrors[];
  controlErrors?: FormControlErrors[];
}

export interface FormGroupErrors {
  match: string | string[];
  controls: FormControlErrors[];
}

export interface FormControlErrors {
  match: string | string[];
  errors: FormErrors;
  sortBy?: SortBy;
}

export interface FormError {
  type: string;
  message: string | ((error: any) => string);
  priority?: number;
}

export type FormErrors = { [error: string]: FormError };

export type CompareFunction = (a: FormError, b: FormError) => number;
export type SortBy = 'priority' | CompareFunction;
