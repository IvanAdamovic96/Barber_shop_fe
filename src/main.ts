import { bootstrapApplication } from '@angular/platform-browser';
import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap/dist/js/bootstrap.bundle.js'
import '../node_modules/angular-calendar/css/angular-calendar.css';
import { registerLocaleData } from '@angular/common';
import localeSr from '@angular/common/locales/sr-Latn';
import { appConfig } from './app/app.config';

registerLocaleData(localeSr, 'sr');

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
