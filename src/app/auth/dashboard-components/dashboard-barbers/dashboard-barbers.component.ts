import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { showConfirm, showError, showSuccess } from '../../../../utils';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BarberService } from '../../../services/barber.service';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-barbers',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard-barbers.component.html',
  styleUrl: './dashboard-barbers.component.css'
})
export class DashboardBarbersComponent implements OnInit {

  //barbers: any[] = [];
  userEmail: string = '';
  selectedCompanyId: string | null = null;
  companies: any[] = [];
  selectedCompanyName: string | null = null; // To display selected company name
  barbersOfSelectedCompany: any[] = []; // New property to hold barbers
  isLoadingBarbers: boolean = false;
  barbersError: string = '';

  selectedBarberForEdit: any | null = null;
  isEditing: boolean = false;
  isLoadingBarberForEdit: boolean = false;
  editBarberError: string = '';

  barberForm: FormGroup;

  constructor(private authService: AuthService, private barberService: BarberService) {
    this.barberForm = new FormGroup({
      barberName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      individualStartTime: new FormControl('', Validators.required),
      individualEndTime: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.userEmail = this.authService.getEmail();
    //console.log('User Email:', this.userEmail);

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
      this.barbersOfSelectedCompany = [];
      this.isEditing = false;
      this.selectedBarberForEdit = null;
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
        //console.log('Barbers for selected company:', this.barbersOfSelectedCompany);
      },
      error: (error: HttpErrorResponse) => {
        this.barbersError = 'Greška oko prikazivanja frizera: ' + error.error.message;
        showError(this.barbersError);
        this.isLoadingBarbers = false;
        console.error('Greška oko prikazivanja frizera: ', error.error.message);
      }
    })
  }




  editBarber(barberId: string): void {
    //console.log('Editing barber with ID:', barberId);
    this.selectedBarberForEdit = null;
    this.isEditing = false;
    this.isLoadingBarberForEdit = true;
    this.editBarberError = '';


    this.barberService.getBarberDetailsByBarberId(barberId).subscribe({
      next: (response) => {
        this.selectedBarberForEdit = response;
        this.isEditing = true;
        this.isLoadingBarberForEdit = false;

        this.barberForm.patchValue({
          barberName: response.barberName,
          phoneNumber: response.phoneNumber,
          email: response.email,
          individualStartTime: response.individualStartTime,
          individualEndTime: response.individualEndTime
        });

        setTimeout(() => {
          const editFormElement = document.getElementById('editBarberForm');
          if (editFormElement) {
            editFormElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);

      },
      error: (error: HttpErrorResponse) => {
        this.editBarberError = 'Nije moguće učitati detalje frizera za izmenu.';
        this.isLoadingBarberForEdit = false;
        console.error('Error loading barber for edit:', error.error.message);
        showError(error.error.message);
      }
    });
  }



  deleteBarber(barberId: string) {
    showConfirm('Da li ste sigurni da želite da obrišete ovog frizera?', () => {
      this.barberService.deleteBarber(barberId).subscribe({
        next: (response) => {
          showSuccess(response);
          this.loadBarbersForCompany(this.selectedCompanyId!);
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Došlo je do greške prilikom brisanja frizera.';
          if (error.error?.message) {
            errorMessage += ' ' + error.error.message;
          } else if (error.statusText) {
            errorMessage += ' ' + error.statusText;
          }
          showError(error.error.message);
          console.error('Error deleting barber:', error);
        }
      });
    })
  }



  onSubmitEdit(): void {
    if (!this.selectedBarberForEdit) {
      showError('Nije izabran frizer za izmenu.');
      return;
    }
    if (this.barberForm.invalid) {
      showError('Molimo popunite sva obavezna polja.');
      this.barberForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('UpdateBarberDto.BarberId', this.selectedBarberForEdit.barberId);
    formData.append('UpdateBarberDto.BarberName', this.barberForm.get('barberName')?.value || '');
    formData.append('UpdateBarberDto.PhoneNumber', this.barberForm.get('phoneNumber')?.value || '');
    formData.append('UpdateBarberDto.Email', this.barberForm.get('email')?.value || '');
    formData.append('UpdateBarberDto.IndividualStartTime', this.barberForm.get('individualStartTime')?.value || '');
    formData.append('UpdateBarberDto.IndividualEndTime', this.barberForm.get('individualEndTime')?.value || '');

    //console.log('Submitting form data:', ...formData.entries());

    showConfirm('Da li ste sigurni da želite da sačuvate izmene?', () => {
      this.barberService.updateBarberDetails(formData).subscribe({
        next: (response) => {
          showSuccess(response);
          this.loadBarbersForCompany(this.selectedCompanyId!);
          this.cancelEdit();
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Došlo je do greške prilikom izmene frizera.';
          if (error.error?.message) {
            errorMessage += ' ' + error.error.message;
          } else if (error.statusText) {
            errorMessage += ' ' + error.statusText;
          }
          showError(error.error.message);
          console.error('Error updating owner:', error);
        }
      });
    });



  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedBarberForEdit = null;
    this.editBarberError = '';
    //this.companyForm.reset();
  }

}
