import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BarberService } from '../services/barber.service';
import { Subscription } from 'rxjs';
import { showError, showSuccess } from '../../utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-haircut',
  imports: [FormsModule],
  templateUrl: './add-haircut.component.html',
  styleUrl: './add-haircut.component.css'
})
export class AddHaircutComponent implements OnInit {
  haircutType: string = ''
  price: number = 0
  duration: number = 0
  companyId: string | null = null
  routeSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private barberService: BarberService, private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit(): void {
    const formData = new FormData();

    this.companyId = this.route.snapshot.paramMap.get('companyId');

    formData.append('HaircutDto.HaircutType', this.haircutType)
    formData.append('HaircutDto.Price', this.price.toString())
    formData.append('HaircutDto.Duration', this.duration.toString())
    if (this.companyId) {
      formData.append('HaircutDto.CompanyId', this.companyId)
    }

    console.log(this.companyId)

    this.barberService.createHaircut(formData).subscribe({
      next: (response) => {
        this.router.navigate(['/companies', this.companyId]);
        showSuccess('Usluga uspješno kreirana!');
        this.haircutType = '';
        this.price = 0;
        this.duration = 0;
        console.log(response);

      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          showError('Greška: Molimo provjerite unesene podatke. ' + error.error.message);
        } else if (error.status === 500) {
          showError('Greška na serveru. Pokušajte kasnije. ' + error.error.message);
        } else {
          showError('Nepoznata greška. Pokušajte ponovo. ' + error.error.message);
        }
        console.error('Greška prilikom kreiranja usluga:', error.error.message);
      }
    })

  }

}
