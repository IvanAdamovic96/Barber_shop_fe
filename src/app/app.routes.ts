import { Routes } from '@angular/router';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyBarbersComponent } from './company-barbers/company-barbers.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'companies', pathMatch: 'full' },
    { path: 'home', component:HomeComponent},
    { path: 'companies', component: CompaniesComponent },
    { path: 'companies/:id', component: CompanyBarbersComponent },
    { path: 'create-company', component: CreateCompanyComponent },
    { path: '**' , redirectTo: '/home'}
];
