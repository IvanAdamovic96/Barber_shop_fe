import { Component } from '@angular/core';
import { BarberService } from '../../../services/barber.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-companies',
  imports: [],
  templateUrl: './dashboard-companies.component.html',
  styleUrl: './dashboard-companies.component.css'
})
export class DashboardCompaniesComponent {

  companies: any[] = [];
  filteredCompaniesByOwnerId: any[] = [];
  

  constructor(private barberService: BarberService, private authService: AuthService) { }



}
