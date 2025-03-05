import { Routes } from '@angular/router';
import { LandingPageComponent } from './Pages/landing-page/landing-page.component';
import { BusinessMasterComponent } from './Pages/business-master/business-master.component';
import { SystemParameterComponent } from './Pages/system-parameter/system-parameter.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'businessMaster',
    component: BusinessMasterComponent,
  },
  {
    path: 'systemParameter',
    component: SystemParameterComponent,
  },
];
