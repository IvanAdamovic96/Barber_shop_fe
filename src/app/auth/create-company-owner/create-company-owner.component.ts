import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

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

    this.authService.createCompanyOwner(formData).subscribe({
      next: (response) => {
        this.owner = response.data
        console.log('Uspešno kreiran Vlasnik kompanije:', response);
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
          alert(messages.join('\n'));
        } else {
          alert('Greška pri registraciji.');
          console.log(error);
        }
      }
    });
  }
}
