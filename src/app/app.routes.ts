import { Routes } from '@angular/router';
import { LandingPageComponent } from './Pages/landing-page/landing-page.component';
import { BusinessMasterComponent } from './Pages/business-master/business-master.component';
import { SystemParameterComponent } from './Pages/system-parameter/system-parameter.component';
import { OrderConfirmComponent } from './Pages/order-confirm/order-confirm.component';
import { ConfirmInoviceComponent } from './Pages/confirm-inovice/confirm-inovice.component';

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
  {
    path: 'orderConfirm',
    component: OrderConfirmComponent,
  },
  {
    path: 'confirmInvoice',
    component: ConfirmInoviceComponent,
  },
];
