import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BarberService } from '../services/barber.service';
import { Subscription } from 'rxjs';

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

  constructor(private route: ActivatedRoute, private barberService: BarberService) { }

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
        console.log(response);

      },
      error: (error) => {
        console.error('Greška prilikom kreiranja usluga:', error);
      }
    })

  }

}
