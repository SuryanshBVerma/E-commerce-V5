import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { ListProductsComponent } from './pages/products/products.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminLoginComponent } from './pages/login/login.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { ManageAdminsComponent } from './pages/manage-admins/manage-admins.component';
import { ManageOrdersComponent } from './pages/manage-orders/manage-orders.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


const routes: Routes = [
  { path: 'login', component: AdminLoginComponent },
  
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminAuthGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, 
      { path: 'products', component: ListProductsComponent },
      { path: 'manage-users', component: ListUsersComponent },
      { path: 'manage-admins', component: ManageAdminsComponent},
      { path: 'manage-orders', component: ManageOrdersComponent},
      { path: 'dashboard', component: DashboardComponent},
      // Add more admin routes here
    ]
  },
];

@NgModule({
  declarations : [
    
  ],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
