import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BarberService } from '../services/barber.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-barber',
  imports: [FormsModule],
  templateUrl: './create-barber.component.html',
  styleUrl: './create-barber.component.css'
})
export class CreateBarberComponent {
  companyId: string | null = null;

  constructor(private barberService: BarberService, private route: ActivatedRoute) { }



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
          individualStartTime: form.value.individualStartTime,
          individualEndTime: form.value.individualEndTime
        }
      }

      this.barberService.createBarber(barberCreate).subscribe({
        next: (response) => {
          form.reset()

        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
        }
      })

    }
  }

}
