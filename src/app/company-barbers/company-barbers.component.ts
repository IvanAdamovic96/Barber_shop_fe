import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BarberService } from '../services/barber.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-barbers',
  imports: [CommonModule],
  templateUrl: './company-barbers.component.html',
  styleUrl: './company-barbers.component.css'
})
export class CompanyBarbersComponent implements OnInit {
  companyId: string | null = null;
  barbers: any[] = [];
  constructor(private barberService: BarberService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.companyId = this.route.snapshot.paramMap.get('id');

    if (this.companyId) {
      this.barberService.getAllBarbersByCompanyId(this.companyId).subscribe({
        next: (data) => {
          this.barbers = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }

  }


}
