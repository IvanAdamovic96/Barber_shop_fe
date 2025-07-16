import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { showError } from '../../../utils';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phoneNumber: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(private authService: AuthService, private router: Router) {

  }
  onSubmit(): void {
    const formData = new FormData();

    formData.append('Register.Email', this.email);
    formData.append('Register.Password', this.password);
    formData.append('Register.ConfirmPassword', this.confirmPassword);
    formData.append('Register.PhoneNumber', this.phoneNumber);
    formData.append('Register.FirstName', this.firstName);
    formData.append('Register.LastName', this.lastName);

    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Uspešna registracija:', response);
        this.router.navigate(['/login']);
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
          showError(messages.join('\n'));
          //alert(messages.join('\n'));
        } else {
          showError('Greška pri registraciji. Molimo pokušajte ponovo.');
          //alert('Greška pri registraciji.');
          console.log(error);
        }
      }
    });
  }
}