import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { showError, showSuccess } from '../../../utils';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';


  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }



  onSubmit(): void {
    const formData = new FormData();

    formData.append('LoginDto.Email', this.email);
    formData.append('LoginDto.Password', this.password);


    this.authService.login(formData).subscribe({
      next: (response) => {
        //this.toastr.success('Login successful', 'Success');
        //showSuccess('Login successful');
        this.router.navigate(['/home'])

        this.authService.setOwnerCompanyId(response.companyIds);

        console.log('Login successful:', response);

      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          if (error.error?.errors) {
            const validationErrors = error.error.errors;
            const messages: string[] = [];
            for (const field in validationErrors) {
              if (validationErrors.hasOwnProperty(field)) {
                messages.push(...validationErrors[field]);
              }
            }
            showError(messages.join('\n'));
          }
          else if (error.error?.detail) {
            showError(error.error.detail);
          } else {
            showError('Greška pri prijavi. Podaci nisu validni.');
          }
        }
        else if (error.status === 500) {
          console.error('Server error:', error.error?.message || error.message);
          showError('Greška na serveru. Pokušajte ponovo kasnije.');
        }
        else {
          showError('Neočekivana greška. Status: ' + error.status);
        }
      }
    });
  }
}

