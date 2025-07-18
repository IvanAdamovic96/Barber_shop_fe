import { Component, OnInit } from '@angular/core';
import { BarberService } from '../../../services/barber.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { showConfirm, showError, showSuccess } from '../../../../utils';


@Component({
  selector: 'app-dashboard-companies',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-companies.component.html',
  styleUrl: './dashboard-companies.component.css'
})
export class DashboardCompaniesComponent implements OnInit {

  companies: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';


  constructor(private barberService: BarberService, private authService: AuthService,
    private router: Router, private toastr: ToastrService
  ) { }


  ngOnInit(): void {

    if (!this.authService.isAdmin()) {
      this.router.navigate(['/companies']);
      return;
    }

    this.loadCompanies();
  }


  loadCompanies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.barberService.getAllCompanies().subscribe({
      next: (comp) => {
        this.companies = comp
        this.isLoading = false;
        console.log('Companies loaded:', this.companies);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Došlo je do greške prilikom učitavanja kompanija.';
        this.isLoading = false;
        this.toastr.error(error.error.message);
        console.error('Error loading companies:', error);
      }
    });
  }



  deleteCompany(companyid: string): void {
    showConfirm('Da li ste sigurni da želite da obrišete ovu kompaniju?', () => {
      this.barberService.deleteCompany(companyid).subscribe({
        next: () => {
          showSuccess('Kompanija uspešno obrisana.');
          this.router.navigate(['/dashboard/companies']);
        },
        error: (error: HttpErrorResponse) => {
          showError('Došlo je do greške prilikom brisanja kompanije. ' + error.error.message);
          console.error('Error deleting company:', error.error.message);
        }
      });
    })
  }


  editCompany(arg0: any) {
    throw new Error('Method not implemented.');
  }



}
