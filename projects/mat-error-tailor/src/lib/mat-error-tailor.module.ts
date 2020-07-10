import { NgModule, ModuleWithProviders } from '@angular/core';
import {
  MatErrorTailorDirective,
  ErrorGroupNameDirective,
  ErrorControlNameDirective,
} from './mat-error-tailor.directive';
import { MatErrorTrailorConfigProvider } from './providers';
import { MatErrorTailorConfig } from './types';

@NgModule({
  declarations: [MatErrorTailorDirective, ErrorGroupNameDirective, ErrorControlNameDirective],
  imports: [],
  exports: [MatErrorTailorDirective, ErrorGroupNameDirective, ErrorControlNameDirective],
  entryComponents: [],
})
export class MatErrorTailorModule {
  static forRoot(config: MatErrorTailorConfig): ModuleWithProviders<MatErrorTailorModule> {
    return {
      ngModule: MatErrorTailorModule,
      providers: [
        {
          provide: MatErrorTrailorConfigProvider,
          useValue: config,
        },
      ],
    };
  }
}
