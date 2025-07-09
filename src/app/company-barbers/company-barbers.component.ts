import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BarberService } from '../services/barber.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CreateCompanyOwnerComponent } from '../auth/create-company-owner/create-company-owner.component';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-company-barbers',
  imports: [CommonModule, RouterLink, FormsModule, CreateCompanyOwnerComponent],
  templateUrl: './company-barbers.component.html'

})

export class CompanyBarbersComponent implements OnInit {



  selectedAppointment: string | null = null;
  companyId: string | null = null;
  barbers: any[] = [];
  selectedBarberId: string | null = null;
  selectedDate: Date = new Date();
  today: string = "";
  datepicker: Date = new Date();
  company: any;


  //(YYYY-MM-DD)
  freeAppointments: any[] = [];
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phoneNumber: string = "";
  haircut: string = "";
  isLoggedIn = false;
  isAdmin = false;
  routeSubscription: Subscription | undefined;
  currentEntityId: string | null = null;

  constructor(private barberService: BarberService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.currentEntityId = params.get('companyId'); // 'id' mora da se poklapa sa onim u ruting konfiguraciji
      if (this.currentEntityId) {
        console.log('ID dohvaćen u roditelj komponenti:', this.currentEntityId);
      } else {
        console.warn('ID nije pronađen u URL-u roditelj komponente.');
      }
    });



    this.authService.isLoggedin$.subscribe(status => {
      this.isLoggedIn = status
    })

    
    this.isAdmin = this.authService.isAdmin();

    const now = new Date();

    this.today = now.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'


    this.companyId = this.route.snapshot.paramMap.get('id');



    if (this.companyId) {
      this.barberService.getAllBarbersByCompanyId(this.companyId).subscribe({
        next: (data) => {
          this.barbers = data;
          console.log(this.barbers)
        },
        error: (err) => {
          console.error(err);
        }
      });

      this.barberService.getCompanyDetailsById(this.companyId).subscribe({
        next: (data) => {
          this.company = data;
          console.log(this.company)
        },
        error: (err) => {
          console.error(err);
        }
      });
    }

  }






  onBarberClick(barberId: string): void {
    this.selectedBarberId = barberId;
    this.loadAppointments();
  }

  onDateChange(): void {
    if (typeof this.selectedDate === 'string') {
      this.selectedDate = new Date(this.selectedDate); // konvertuj iz stringa u Date
    }

    if (this.selectedBarberId) {
      this.loadAppointments();
    }
  }
  onDatePick(date: string): void {
    this.selectedAppointment = date;
    console.log(date)
  }

  loadAppointments(): void {
    //const date = new Date(this.selectedDate); //  osiguraj da je Date objekat

    this.barberService.getAllFreeAppointmentsByBarberId(this.selectedDate, this.selectedBarberId!).subscribe({
      next: (data) => {
        console.log(data);
        this.freeAppointments = data
        console.log(this.freeAppointments)
      },
      error: (err) => console.error(err)
    });
  }
  /*
  
  */

  onSubmit(): void {
    const formData = new FormData();

    let selectedDateTime: Date;
    if (typeof this.datepicker === 'string') {
      selectedDateTime = new Date(this.datepicker);
    } else {
      selectedDateTime = this.datepicker;
    }

    // Dodaj sva polja sa tačnim nazivima koje backend očekuje
    formData.append('Schedule.firstName', this.firstName);
    formData.append('Schedule.lastName', this.lastName);
    formData.append('Schedule.email', this.email);
    formData.append('Schedule.phoneNumber', this.phoneNumber);
    formData.append('Schedule.haircut', this.haircut);
    formData.append('Schedule.time', this.selectedAppointment!);

    if (this.selectedBarberId) {
      formData.append('Schedule.barberId', this.selectedBarberId);
    }

    // Poziv servisa
    this.barberService.createSchedule(formData).subscribe({
      next: (response) => {
        console.log('Uspešno zakazano:', response);
      },
      error: (error) => {
        console.error('Greška prilikom zakazivanja:', error);
      }
    });

  }


}
