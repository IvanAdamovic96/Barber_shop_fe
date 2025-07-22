import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BarberService } from '../services/barber.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { showConfirm, showError, showSuccess } from '../../utils';

@Component({
  selector: 'app-create-barber',
  imports: [FormsModule],
  templateUrl: './create-barber.component.html',
  styleUrl: './create-barber.component.css'
})
export class CreateBarberComponent {
  companyId: string | null = null;
  check: boolean = false;

  constructor(private barberService: BarberService, private authService: AuthService, private route: ActivatedRoute,
    private router: Router
  ) { }




  onSubmit(form: NgForm) {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    console.log(this.companyId)

    if (form.value) {

      const barberCreate = {
        barber: {
          companyId: this.companyId,
          barberName: form.value.barberName,
          phoneNumber: form.value.phoneNumber,
          email: form.value.email,
          password: form.value.password,
          individualStartTime: form.value.individualStartTime,
          individualEndTime: form.value.individualEndTime
        }
      }

      showConfirm('Da li ste sigurni da želite da kreirate frizera sa ovim podacima?', () => {
        this.barberService.createBarber(barberCreate).subscribe({
          next: (response) => {
            form.reset()
            showSuccess('Frizer je uspešno kreiran.');
            this.router.navigate(['/companies', this.companyId]);
            console.log(response);
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 400) {
              showError('Molimo Vas da popunite sva polja.');
            } else if (error.status === 500) {
              showError('Došlo je do greške na serveru. Molimo pokušajte ponovo kasnije.');
            } else {
              showError(error.error.message || 'Došlo je do greške prilikom kreiranja frizera.');
              console.log(error)
            }
          }
        })
      })
    }
  }

}
