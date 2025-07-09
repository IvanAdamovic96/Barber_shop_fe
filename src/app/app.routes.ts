import { Routes } from '@angular/router';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyBarbersComponent } from './company-barbers/company-barbers.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { HomeComponent } from './home/home.component';
import { CreateBarberComponent } from './create-barber/create-barber.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminGuard } from './auth/guards/guards';
import { RegisterComponent } from './auth/register/register.component';
import { CreateCompanyOwnerComponent } from './auth/create-company-owner/create-company-owner.component';

export const routes: Routes = [
    { path: '', redirectTo: 'companies', pathMatch: 'full' },
    { path: 'home', component:HomeComponent},
    { path: 'companies', component: CompaniesComponent },
    { path: 'companies/:id', component: CompanyBarbersComponent },
    { path: 'create-company', component: CreateCompanyComponent,canActivate:[AdminGuard]},
    { path: 'create-barber/:companyId', component: CreateBarberComponent,canActivate:[AdminGuard] },
    { path: 'login', component: LoginComponent },
   { path: 'register', component: RegisterComponent },
   {path: 'create-company-owner/:companyId',component:CreateCompanyOwnerComponent,canActivate:[AdminGuard]}



];
