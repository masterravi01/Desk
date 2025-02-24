import { Routes } from '@angular/router';
import { UserComponent } from './Pages/user/user.component';
import { ProductsComponent } from './Pages/products/products.component';
import { UserEditComponent } from './Pages/user-edit/user-edit.component';

export const routes: Routes = [{
    path: '',
    component: UserComponent
},
{
    path: 'products',
    component: ProductsComponent
},
{
    path: 'edit/:id',
    component: UserEditComponent
},
{
    path: 'users',
    component: UserComponent
},
];
