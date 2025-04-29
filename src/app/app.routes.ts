import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

import { RegisterComponent } from './pages/register/register.component';
import { ProductComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { OrderHistoryPageComponent } from './pages/orderHistoryPage/orderHistorypage';
import { authGuard } from './guards/auth.guard';



export const routes: Routes = [
    // For Routing to Modules
    {
        path: "admin",
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    },
    { path: "", component: LoginComponent },
    { path: "login", component: LoginComponent},
    { path: "register", component: RegisterComponent },
    { path: "products", component: ProductComponent },
    {
        path: "cart",
        component: CartComponent,
        canActivate : [authGuard],
        children: [
            { path: 'success', component: CartComponent },
            { path: 'failure', component: CartComponent } 
        ]
    },
    { path: "profile", component: ProfileComponent, canActivate : [authGuard] },
    { path: "orders", component: OrderHistoryPageComponent, canActivate : [authGuard] },
    { path: "**", component: PageNotFoundComponent},

];
