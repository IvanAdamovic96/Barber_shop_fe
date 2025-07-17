import { Component, OnInit } from '@angular/core';
import { BarberService } from '../services/barber.service';
import { CommonModule, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { showError } from '../../utils';

@Component({
  selector: 'app-companies',
  imports: [CommonModule, RouterLink, NgIf, NgFor],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent implements OnInit {

  companies: any[] = [];
  filteredCompaniesByOwnerId: any[] = [];
  isLoggedIn = false;
  isAdmin = false;
  isOwner = false;

  constructor(private barberService: BarberService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedin$.subscribe(status => {
      this.isLoggedIn = status

    })
    this.isAdmin = this.authService.isAdmin();
    this.isOwner = this.authService.isOwner();

    this.barberService.getAllCompanies().subscribe({
      next: (data) => {
        this.companies = data.map(company => ({
          ...company,
          imageUrl: typeof company.imageUrl === 'string' ? [company.imageUrl] : (company.imageUrl ?? []),
          currentImageIndex: 0
        }));

        this.applyOwnerFilter();

        /*
        if (this.authService.isOwner()) {
          const id = this.checkOwner();

          this.filteredCompaniesByOwnerId = this.companies.filter(company => company.companyId === id);
          console.log('Filtered companies for owner:', this.filteredCompaniesByOwnerId);

        }
        */

        console.log(this.companies);
      },
      error: (error: HttpErrorResponse) => {
        showError('Greška prilikom dohvatanja kompanija. ' + error.error.message);
        console.error('Greška prilikom dohvatanja kompanija', error.error.message);
      }
    });




  }


  checkOwner(): string[] {
    const ownerCompanyIds = this.authService.getOwnerCompanyIds();
    if (this.authService.isOwner()) {
      if (ownerCompanyIds) {
        try {
          const ids: string[] = JSON.parse(ownerCompanyIds);
          console.log('Owner company ID from service:', ownerCompanyIds);
          return ids;

        } catch (error) {
          console.error('Error parsing owner company IDs:', error);
          return [];
        }
      }
    }
    return [];
  }

  applyOwnerFilter(): void {
    if (this.authService.isOwner()) {
      const ownerIds = this.checkOwner();

      if (ownerIds && ownerIds.length > 0) {
        this.filteredCompaniesByOwnerId = this.companies.filter(company =>
          ownerIds.includes(company.companyId)
        );
        console.log('Filtrirane kompanije vlasnika:', this.filteredCompaniesByOwnerId);
      } else {
        this.filteredCompaniesByOwnerId = [];
        console.warn('Nema pronađenih ID-jeva za filtriranje kompanija.');
      }
    } else {
      this.filteredCompaniesByOwnerId = this.companies;
    }
  }

  
  nextImage(company: any) {
    if (company.imageUrl.length === 0) return;
    company.currentImageIndex = (company.currentImageIndex + 1) % company.imageUrl.length;
  }


  prevImage(company: any) {
    if (company.imageUrl.length === 0) return;
    company.currentImageIndex = (company.currentImageIndex - 1 + company.imageUrl.length) % company.imageUrl.length;
  }

}
