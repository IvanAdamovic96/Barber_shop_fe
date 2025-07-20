import { Component, OnInit } from '@angular/core';
import { BarberService } from '../../../services/barber.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { showConfirm, showError, showSuccess } from '../../../../utils';

@Component({
  selector: 'app-dashboard-users',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard-users.component.html',
  styleUrl: './dashboard-users.component.css'
})
export class DashboardUsersComponent implements OnInit {

  owners: any[] = [];
  selectedOwner: string = '';

  isLoading: boolean = true;
  errorMessage: string = '';
  selectedOwnerForEdit: any | null = null;
  isEditing: boolean = false;
  isLoadingOwnerForEdit: boolean = false;
  editOwnerError: string = '';

  ownerForm: FormGroup;


  constructor(private barberService: BarberService, private authService: AuthService) {
    this.ownerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    // Učitavanje vlasnika
    this.loadOwners();
  }

  loadOwners(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getOwners().subscribe({
      next: (data) => {
        this.owners = data;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Došlo je do greške prilikom učitavanja vlasnika.';
        this.isLoading = false;
        showError(this.errorMessage);
        console.error('Error loading owners:', error);
      }
    })
  }


  deleteOwner(arg0: any) {
    throw new Error('Method not implemented.');
  }

  editOwner(ownerId: string): void {
    this.selectedOwnerForEdit = null;
    this.isEditing = false;
    this.isLoadingOwnerForEdit = true;
    this.editOwnerError = '';


    this.authService.getOwnerDetailsById(ownerId).subscribe({
      next: (response) => {
        this.selectedOwnerForEdit = response;
        this.isEditing = true;
        this.isLoadingOwnerForEdit = false;

        this.ownerForm.patchValue({
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          phoneNumber: response.phoneNumber
        });

        setTimeout(() => {
          const editFormElement = document.getElementById('editOwnerForm');
          if (editFormElement) {
            editFormElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);

      },
      error: (err) => {
        this.editOwnerError = 'Nije moguće učitati detalje vlasnika za izmenu.';
        this.isLoadingOwnerForEdit = false;
        console.error('Error loading owner for edit:', err);
        showError(this.editOwnerError);
      }
    });
  }

  onSubmitEdit() {
    if (!this.selectedOwnerForEdit) {
      showError('Nema odabrane kompanije za izmenu.');
      return;
    }
    if (this.ownerForm.invalid) {
      showError('Molimo popunite sva obavezna polja.');
      this.ownerForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('UpdateOwnerDto.OwnerId', this.selectedOwnerForEdit.ownerId);
    formData.append('UpdateOwnerDto.FirstName', this.ownerForm.get('firstName')?.value || '');
    formData.append('UpdateOwnerDto.LastName', this.ownerForm.get('lastName')?.value || '');
    formData.append('UpdateOwnerDto.Email', this.ownerForm.get('email')?.value || '');
    formData.append('UpdateOwnerDto.PhoneNumber', this.ownerForm.get('phoneNumber')?.value || '');

    console.log('Submitting form data:', ...formData.entries());

    showConfirm('Da li ste sigurni da želite da sačuvate izmene?', () => {
      this.authService.updateOwnerDetails(formData).subscribe({
        next: () => {
          showSuccess('Vlasnik uspešno izmenjen!');
          this.loadOwners();
          this.cancelEdit();
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Došlo je do greške prilikom izmene vlasnika.';
          if (error.error?.message) {
            errorMessage += ' ' + error.error.message;
          } else if (error.statusText) {
            errorMessage += ' ' + error.statusText;
          }
          showError(errorMessage);
          console.error('Error updating owner:', error);
        }
      });
    });
  }


  cancelEdit(): void {
    this.isEditing = false;
    this.selectedOwnerForEdit = null;
    this.editOwnerError = '';
    //this.companyForm.reset();
  }
}
