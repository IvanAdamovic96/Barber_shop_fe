import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-fixed-top-right',
      preventDuplicates: true,
      progressBar: true
    }),
    importProvidersFrom(CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })),

    importProvidersFrom(MatToolbarModule, MatButtonModule)
  ]
};
