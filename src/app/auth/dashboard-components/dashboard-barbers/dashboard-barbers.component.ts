import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { showError } from '../../../../utils';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BarberService } from '../../../services/barber.service';

@Component({
  selector: 'app-dashboard-barbers',
  imports: [CommonModule],
  templateUrl: './dashboard-barbers.component.html',
  styleUrl: './dashboard-barbers.component.css'
})
export class DashboardBarbersComponent implements OnInit {

  barbers: any[] = [];
  userEmail: string = '';
  isAdmin: boolean = false;
  check: boolean = false;
  selectedCompanyId: string | null = null;
  companies: any[] = [];
  selectedCompanyName: string | null = null; // To display selected company name
  barbersOfSelectedCompany: any[] = []; // New property to hold barbers
  isLoadingBarbers: boolean = false;
  barbersError: string = '';

  constructor(private authService: AuthService, private barberService: BarberService) { }

  ngOnInit(): void {
    this.userEmail = this.authService.getEmail();
    console.log('User Email:', this.userEmail);

    this.loadCompanies();

  }

  loadCompanies(): void {
    this.authService.getCompaniesByOwnerEmail(this.userEmail).subscribe({
      next: (response) => {
        this.companies = response;
        console.log('Companies:', this.companies);
      },
      error: (error: HttpErrorResponse) => {
        showError('Greška oko prikazivanja kompanija: ' + error.error.message);
        console.error('Greška oko prikazivanja kompanija: ', error);
      }
    })
  }

  onCompanyClick(companyId: string): void {

    if (this.selectedCompanyId === companyId) {
      this.selectedCompanyId = null;
      this.selectedCompanyName = null;
      this.barbersOfSelectedCompany = [];
      return;
    }

    this.selectedCompanyId = companyId;
    const company = this.companies.find(c => c.companyId === companyId);
    this.selectedCompanyName = company ? company.companyName : 'Nepoznata kompanija';
    console.log('Selected Company ID:', this.selectedCompanyId);

    this.loadBarbersForCompany(companyId);
  }

  loadBarbersForCompany(companyId: string) {
    this.barberService.getAllBarbersByCompanyId(companyId).subscribe({
      next: (response) => {
        this.barbersOfSelectedCompany = response;
        this.isLoadingBarbers = false;
        console.log('Barbers for selected company:', this.barbersOfSelectedCompany);
      },
      error: (error: HttpErrorResponse) => {
        this.barbersError = 'Greška oko prikazivanja frizera: ' + error.error.message;
        showError(this.barbersError);
        this.isLoadingBarbers = false;
        console.error('Greška oko prikazivanja frizera: ', error.error.message);
      }
    })
  }

  deleteBarber(arg0: any) {
    throw new Error('Method not implemented.');
  }

  editBarber(arg0: any) {
    throw new Error('Method not implemented.');
  }
}
