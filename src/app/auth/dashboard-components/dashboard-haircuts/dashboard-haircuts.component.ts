import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BarberService } from '../../../services/barber.service';
import { HttpErrorResponse } from '@angular/common/http';
import { showError } from '../../../../utils';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-haircuts',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard-haircuts.component.html',
  styleUrl: './dashboard-haircuts.component.css'
})
export class DashboardHaircutsComponent implements OnInit {

  userEmail: string = '';
  selectedCompanyId: string | null = null;
  companies: any[] = [];
  selectedCompanyName: string | null = null;
  haircutsOfSelectedCompany: any[] = [];
  isLoadingBarbers: boolean = false;
  barbersError: string = '';

  selectedHaircutForEdit: any | null = null;
  isEditing: boolean = false;
  isLoadingHaircutForEdit: boolean = false;
  editHaircutError: string = '';

  haircutForm: FormGroup;

  constructor(private authService: AuthService, private barberService: BarberService) {
    this.haircutForm = new FormGroup({
      haircutType: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required)
    });
  }
  ngOnInit(): void {
    this.userEmail = this.authService.getEmail();

    this.loadCompanies();
  }

  loadCompanies(): void {
    this.authService.getCompaniesByOwnerEmail(this.userEmail).subscribe({
      next: (response) => {
        this.companies = response;
        //console.log('Companies:', this.companies);
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
      this.haircutsOfSelectedCompany = [];
      this.isEditing = false;
      this.selectedHaircutForEdit = null;
      return;
    }

    this.selectedCompanyId = companyId;
    const company = this.companies.find(c => c.companyId === companyId);
    this.selectedCompanyName = company ? company.companyName : 'Nepoznata kompanija';
    console.log('Selected Company ID:', this.selectedCompanyId);

    this.loadHaircutsForCompany(companyId);
  }

  loadHaircutsForCompany(companyId: string) {
    this.barberService.getAllHaircutsByCompanyId(companyId).subscribe({
      next: (response) => {
        this.haircutsOfSelectedCompany = response;
        this.isLoadingBarbers = false;
        console.log('Barbers for selected company:', this.haircutsOfSelectedCompany);
      },
      error: (error: HttpErrorResponse) => {
        this.barbersError = 'Greška oko prikazivanja frizera: ' + error.error.message;
        showError(this.barbersError);
        this.isLoadingBarbers = false;
        console.error('Greška oko prikazivanja frizera: ', error.error.message);
      }
    })
  }

  
  deleteHaircut(arg0: any) {
    throw new Error('Method not implemented.');
  }

  editHaircut(haircutId: string): void {
    this.selectedHaircutForEdit = null;
    this.isEditing = false;
    this.isLoadingHaircutForEdit = true;
    this.editHaircutError = '';


    this.barberService.getHaircutDetailsById(haircutId).subscribe({
      next: (response) => {
        this.selectedHaircutForEdit = response;
        this.isEditing = true;
        this.isLoadingHaircutForEdit = false;

        this.haircutForm.patchValue({
          haircutType: response.haircutType,
          price: response.price,
          duration: response.duration
        });

        setTimeout(() => {
          const editFormElement = document.getElementById('editHaircutForm');
          if (editFormElement) {
            editFormElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);

      },
      error: (error: HttpErrorResponse) => {
        this.editHaircutError = 'Nije moguće učitati detalje usluge za izmenu.';
        this.isLoadingHaircutForEdit = false;
        console.error('Error loading haircut for edit:', error.error.message);
        showError(error.error.message);
      }
    });
  }


  onSubmitEdit() {
    //ovo uraditi !!!!
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedHaircutForEdit = null;
    this.editHaircutError = '';
  }
}
