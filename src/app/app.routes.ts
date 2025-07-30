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
import { DashboardReservationsComponent } from './auth/dashboard-components/dashboard-reservations/dashboard-reservations.component';
import { DashboardBarberAppointmentsComponent } from './auth/dashboard-components/dashboard-barber-appointments/dashboard-barber-appointments.component';
import { BarberGuard } from './auth/guards/barber-guard';
import { DashboardAppointmentsManagementComponent } from './auth/dashboard-components/dashboard-appointments-management/dashboard-appointments-management.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, title: 'BarberApp - Naslovna' },
    { path: 'about', component: AboutComponent, title: 'BarberApp - O nama' },
    { path: 'contact', component: ContactComponent, title: 'BarberApp - Kontakt' },
    { path: 'companies', component: CompaniesComponent, title: 'BarberApp - Kompanije' },
    { path: 'companies/:id', component: CompanyBarbersComponent, title: 'BarberApp - Detalji kompanije' },
    { path: 'create-company', component: CreateCompanyComponent, canActivate: [AdminGuard], title: 'BarberApp - Kreiranje kompanije' },
    { path: 'create-barber/:companyId', component: CreateBarberComponent, canActivate: [OwnerGuard], title: 'BarberApp - Kreiranje frizera' },
    { path: 'create-haircut/:companyId', component: AddHaircutComponent, canActivate: [OwnerGuard], title: 'BarberApp - Kreiranje usluga' },
    { path: 'login', component: LoginComponent, title: 'BarberApp - Login' },
    { path: 'register', component: RegisterComponent, title: 'BarberApp - Registracija' },
    { path: 'create-company-owner/:companyId', component: CreateCompanyOwnerComponent, canActivate: [AdminGuard] },
    {
        path: 'dashboard', component: DashboardComponent,
        children: [
            /* { path: '', redirectTo: '', pathMatch: 'full'}, */
            { path: 'home', component: DashboardHomeComponent, canActivate: [AdminGuard], title: 'Panel - Admin' },
            { path: 'companies', component: DashboardCompaniesComponent, canActivate: [AdminGuard], title: 'Panel - Kompanije' },
            { path: 'users', component: DashboardUsersComponent, canActivate: [AdminGuard], title: 'Panel - Korisnici' },
            { path: 'appointments', component: DashboardAppointmentsComponent, canActivate: [OwnerGuard], title: 'Panel - Termini' },
            { path: 'barbers', component: DashboardBarbersComponent, canActivate: [OwnerGuard], title: 'Panel - Frizeri' },
            { path: 'haircuts', component: DashboardHaircutsComponent, canActivate: [OwnerGuard], title: 'Panel - Usluge' },
            { path: 'barber-appointments', component: DashboardBarberAppointmentsComponent, canActivate: [BarberGuard], title: 'Panel - Zakazivanja' },
            { path: 'barber-management', component: DashboardAppointmentsManagementComponent, canActivate: [BarberGuard], title: 'Panel - Menadžment' },
            { path: 'reservations', component: DashboardReservationsComponent, title: 'Panel - Rezervisani termini' },
        ]
    },
    { path: '**', redirectTo: 'home' }
];
