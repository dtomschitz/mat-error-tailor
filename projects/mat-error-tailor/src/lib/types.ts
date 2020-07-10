export interface MatErrorTailorConfig {
  defaultErrors?: {
    errors: FormError[];
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
  errors: FormError[];
  sortBy?: SortBy;
}

export interface FormError {
  type: string;
  message: string | ((error: any) => string);
  priority?: number;
}

export type CompareFunction = (a: FormError, b: FormError) => number;
export type SortBy = 'priority' | CompareFunction;
