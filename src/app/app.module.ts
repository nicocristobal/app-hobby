import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environment/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
import { CategoriesComponent } from './categories/categories.component';
import { ActivitiesComponent } from './activities/activities.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // Para los servicios HTTP
import { AdminComponent } from './admin/admin.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { UserService } from './services/user.service';
import { ImageService } from './services/image.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageManagerComponent } from './admin/image-manager/image-manager.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyComponent } from './company/company.component';
import { AdvertisingComponent } from './company/advertising/advertising.component';
import { AdvertisingService } from './services/advertising.service';
import { ContactComponent } from './footer/contact/contact.component';
import { AboutComponent } from './footer/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CategoriesComponent,
    ActivitiesComponent,
    AdminComponent,
    FooterComponent,
    ProfileComponent,
    HeaderComponent,
    ImageManagerComponent,
    HomeComponent,
    UserManagementComponent,
    CompanyComponent,
    AdvertisingComponent,
    ContactComponent,
    AboutComponent
    
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NgbModule,
    NgbCarouselModule

  ],
  providers: [CategoryService, AuthService, UserService, ImageService,AdvertisingService],
  bootstrap: [AppComponent]
})
export class AppModule { }


