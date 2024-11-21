import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent} from './register/register.component';
import { CategoriesComponent } from './categories/categories.component';
import { ActivitiesComponent } from './activities/activities.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminGuard } from './guards/admin.guard';
import { ImageManagerComponent } from './admin/image-manager/image-manager.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { HomeComponent } from './home/home.component';
import { CompanyComponent } from './company/company.component';
import { CompanyGuard } from './guards/company.guard';
import { AdvertisingComponent } from './company/advertising/advertising.component';
import { ContactComponent } from './footer/contact/contact.component';
import { AboutComponent } from './footer/about/about.component';


const routes: Routes = [ { 
  path: '', redirectTo: '/home', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'category/:id', component: ActivitiesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  

  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'admin/image', component: ImageManagerComponent, canActivate: [AdminGuard] },
  { path: 'admin/user-management', component: UserManagementComponent, canActivate: [AdminGuard] },
  { path: 'company', component: CompanyComponent, canActivate: [CompanyGuard] },
  { path: 'company/advertising', component: AdvertisingComponent, canActivate: [CompanyGuard] }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
