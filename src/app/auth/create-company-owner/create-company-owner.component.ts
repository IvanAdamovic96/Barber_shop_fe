import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { showConfirm, showError, showSuccess } from '../../../utils';

@Component({
  selector: 'app-create-company-owner',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-company-owner.component.html',
  styleUrl: './create-company-owner.component.css'
})
export class CreateCompanyOwnerComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phoneNumber: string = '';
  firstName: string = '';
  lastName: string = '';
  @Input() companyId: string | null = null;
  owner: any;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {

    const formData = new FormData();
    formData.append('CompanyOwnerDto.CompanyId', this.companyId ?? '')
    formData.append('CompanyOwnerDto.Email', this.email);
    formData.append('CompanyOwnerDto.Password', this.password);
    formData.append('CompanyOwnerDto.PhoneNumber', this.phoneNumber);
    formData.append('CompanyOwnerDto.FirstName', this.firstName);
    formData.append('CompanyOwnerDto.LastName', this.lastName);

    showConfirm('Da li ste sigurni da želite da kreirate vlasnika kompanije sa ovim podacima?', () => {
      this.authService.createCompanyOwner(formData).subscribe({
        next: (response) => {
          this.owner = response
          console.log('Uspešno kreiran vlasnik kompanije:', response);
          showSuccess('Uspešno kreiran vlasnik kompanije');
          //window.location.reload();
          this.router.navigate(['/companies']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400 && error.error?.errors) {
            const validationErrors = error.error.errors;
            const messages: string[] = [];

            for (const field in validationErrors) {
              if (validationErrors.hasOwnProperty(field)) {
                messages.push(...validationErrors[field]);
              }
            }
            showError('Greška pri kreiranju vlasnika kompanije: ' + messages.join(', '));
            //alert(messages.join('\n'));
          } else {
            showError(error.error.message);
            //alert('Greška pri registraciji.');
            console.log(error);
          }
        }
      });
    })
  }




}
