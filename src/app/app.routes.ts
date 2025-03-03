import { Routes } from '@angular/router';
import { UserComponent } from './Pages/user/user.component';
import { ProductsComponent } from './Pages/products/products.component';
import { UserEditComponent } from './Pages/user-edit/user-edit.component';
import { BusinessMasterComponent } from './Pages/business-master/business-master.component';
import { SystemParameterComponent } from './Pages/system-parameter/system-parameter.component';

export const routes: Routes = [
  {
    path: '',
    component: UserComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'edit/:id',
    component: UserEditComponent,
  },
  {
    path: 'users',
    component: UserComponent,
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
