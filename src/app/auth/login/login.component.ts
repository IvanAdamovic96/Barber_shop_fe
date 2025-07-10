import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  

  constructor(private authService: AuthService,private router: Router) { }



  onSubmit(): void {
    const formData = new FormData();

    formData.append('LoginDto.Email', this.email);
    formData.append('LoginDto.Password', this.password);


    this.authService.login(formData).subscribe({
      next: (response) => {
        this.router.navigate(['/home'])

        this.authService.setOwnerCompanyId(response.companyId);

        console.log('Login successful:', response);
        
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
        } else if (error.status === 500) {
          alert(error.error.message);
          console.log(error.error.message);
        }
      }
    });
  }
}

