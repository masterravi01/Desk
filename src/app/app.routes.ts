import { Routes } from '@angular/router';
import { UserComponent } from './Pages/user/user.component';
import { ProductsComponent } from './Pages/products/products.component';

export const routes: Routes = [{
    path: '',
    component: UserComponent
},
{
    path: 'products',
    component: ProductsComponent
}
];
