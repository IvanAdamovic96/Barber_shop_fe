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
import { AddHaircutComponent } from './add-haircut/add-haircut.component';
import { OwnerGuard } from './auth/guards/owner-guard';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { DashboardHomeComponent } from './auth/dashboard-components/dashboard-home/dashboard-home.component';
import { DashboardCompaniesComponent } from './auth/dashboard-components/dashboard-companies/dashboard-companies.component';
import { DashboardUsersComponent } from './auth/dashboard-components/dashboard-users/dashboard-users.component';
import { DashboardAppointmentsComponent } from './auth/dashboard-components/dashboard-appointments/dashboard-appointments.component';
import { DashboardBarbersComponent } from './auth/dashboard-components/dashboard-barbers/dashboard-barbers.component';
import { DashboardHaircutsComponent } from './auth/dashboard-components/dashboard-haircuts/dashboard-haircuts.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, title: 'BarberApp - Home' },
    { path: 'about', component: AboutComponent, title: 'BarberApp - About' },
    { path: 'contact', component: ContactComponent, title: 'BarberApp - Contact Us' },
    { path: 'companies', component: CompaniesComponent, title: 'BarberApp - Companies' },
    { path: 'companies/:id', component: CompanyBarbersComponent, title: 'BarberApp - Company details' },
    { path: 'create-company', component: CreateCompanyComponent, canActivate: [AdminGuard], title: 'BarberApp - Create Company' },
    { path: 'create-barber/:companyId', component: CreateBarberComponent, canActivate: [OwnerGuard], title: 'BarberApp - Create Barber' },
    { path: 'create-haircut/:companyId', component: AddHaircutComponent, canActivate: [OwnerGuard], title: 'BarberApp - Create Haircut' },
    { path: 'login', component: LoginComponent, title: 'BarberApp - Login' },
    { path: 'register', component: RegisterComponent, title: 'BarberApp - Register' },
    { path: 'create-company-owner/:companyId', component: CreateCompanyOwnerComponent, canActivate: [AdminGuard] },
    {
        path: 'dashboard', component: DashboardComponent,
        children: [
            /* { path: '', redirectTo: '', pathMatch: 'full'}, */
            { path: 'home', component: DashboardHomeComponent, canActivate: [AdminGuard], title: 'Dashboard - Admin' },
            { path: 'companies', component: DashboardCompaniesComponent, canActivate: [AdminGuard], title: 'Dashboard - Companies' },
            { path: 'users', component: DashboardUsersComponent, canActivate: [AdminGuard], title: 'Dashboard - Users' },
            { path: 'appointments', component: DashboardAppointmentsComponent, canActivate: [OwnerGuard], title: 'Dashboard - Appointments' },
            { path: 'barbers', component: DashboardBarbersComponent, canActivate: [OwnerGuard], title: 'Dashboard - Barbers' },
            { path: 'haircuts', component: DashboardHaircutsComponent, canActivate: [OwnerGuard], title: 'Dashboard - Haircuts' },
        ]
    },
    { path: '**', redirectTo: 'home' }
];
