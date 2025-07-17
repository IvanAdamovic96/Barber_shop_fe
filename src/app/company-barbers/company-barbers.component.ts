import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BarberService } from '../services/barber.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CreateCompanyOwnerComponent } from '../auth/create-company-owner/create-company-owner.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { showConfirm, showError, showSuccess } from '../../utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-company-barbers',
  imports: [CommonModule, RouterLink, FormsModule, CreateCompanyOwnerComponent],
  templateUrl: './company-barbers.component.html',
  styleUrl: './company-barbers.component.css'
})

export class CompanyBarbersComponent implements OnInit {

  check: boolean = false;
  selectedAppointment: string | null = null;
  companyId: string | null = null;
  barbers: any[] = [];
  haircuts: any[] = [];
  selectedBarberId: string | null = null;
  selectedDate: Date = new Date();
  today: string = "";
  datepicker: Date = new Date();
  company: any;
  selectedHaircut: string = '';
  selectedOwner: string = '';
  owners: any[] = [];

  //(YYYY-MM-DD)
  freeAppointments: any[] = [];
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phoneNumber: string = "";
  haircut: string = "";
  isLoggedIn = false;
  isAdmin = false;
  isOwner = false;
  routeSubscription: Subscription | undefined;
  currentEntityId: string | null = null;

  constructor(private barberService: BarberService, private route: ActivatedRoute, 
              private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.currentEntityId = params.get('id');
      if (this.currentEntityId) {
        console.log('ID dohvaćen u roditelj komponenti:', this.currentEntityId);
      } else {
        console.warn('ID nije pronađen u URL-u roditelj komponente.');
      }
    });

    this.companyId = this.route.snapshot.paramMap.get('id');

    if (this.companyId) {
      this.authService.checkIfCompanyOwnerExists(this.companyId).subscribe({
        next: (res) => {
          this.check = res
          console.log("company onwer exist: " + this.check)
        },
        error: (error: HttpErrorResponse) => {
          console.error("Greška prilikom provere vlasnika kompanije:", error.error.message);
          showError("Greška prilikom provere vlasnika kompanije: " + error.error.message);
        }
      });
    } else {
      //console.error("Nedostaje companyId u URL-u");
      showError("Nedostaje companyId u URL-u");
    }


    this.authService.isLoggedin$.subscribe(status => {
      this.isLoggedIn = status
    })


    this.isAdmin = this.authService.isAdmin();
    this.isOwner = this.authService.isOwner();

    const now = new Date();
    this.today = now.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'


    this.authService.getOwners().subscribe({
      next: (res) => {
        this.owners = res
        console.log("Owners: " + this.owners)
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error.message);
        showError("Greška prilikom dobijanja svih vlasnika: " + error.error.message);
      }
    })




    if (this.companyId) {
      this.barberService.getAllBarbersByCompanyId(this.companyId).subscribe({
        next: (data) => {
          this.barbers = data;
          console.log(this.barbers)
        },
        error: (error: HttpErrorResponse) => {
          showError("Greška prilikom dobijanja frizera kompanije: " + error.error.message);
          console.error("Greška prilikom dobijanja frizera kompanije: " + error.error.message);
        }
      });

      this.barberService.getCompanyDetailsById(this.companyId).subscribe({
        next: (data) => {
          this.company = data;
          console.log(this.company)
        },
        error: (error: HttpErrorResponse) => {
          showError("Greška prilikom dobijanja detalja kompanije: " + error.error.message);
          console.error("Greška prilikom dobijanja detalja kompanije: " + error.error.message);
        }
      });

      this.barberService.getAllHaircutsByCompanyId(this.companyId).subscribe({
        next: (data) => {
          this.haircuts = data;
          if (this.haircuts.length > 0) {
            this.selectedHaircut = this.haircuts[0].haircutId;
          }
          console.log(this.haircuts)
        },
        error: (error: HttpErrorResponse) => {
          showError("Greška prilikom dobijanja svih usluga kompanije: " + error.error.message);
          console.log("Greška prilikom dobijanja svih usluga kompanije: " + error.error.message);
        }
      })
    }

  }


  onHaircutChange(haircutId: string) {
    this.selectedHaircut = haircutId;
    console.log("Izabran:", this.selectedHaircut);
  }

  onOwnerSelected(ownerId: string): string {
    this.selectedOwner = ownerId;
    console.log("Izabran:", this.selectedOwner);
    return this.selectedOwner
  }

  onBarberClick(barberId: string): void {
    this.selectedBarberId = barberId;
    this.loadAppointments();
  }

  onDateChange(): void {
    if (typeof this.selectedDate === 'string') {
      this.selectedDate = new Date(this.selectedDate);
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
    this.barberService.getAllFreeAppointmentsByBarberId(this.selectedDate, this.selectedBarberId!).subscribe({
      next: (data) => {
        this.freeAppointments = data
        console.log("Slobodni termini su: " + this.freeAppointments)
      },
      error: (error: HttpErrorResponse) => {
        showError("Greška prilikom dobijanja slobodnih termina: " + error.error.message);
        console.error("Greška prilikom dobijanja slobodnih termina:", error.error.message);
      }
    });
  }


  onSubmit(): void {
    const formData = new FormData();

    let selectedDateTime: Date;
    if (typeof this.datepicker === 'string') {
      selectedDateTime = new Date(this.datepicker);
    } else {
      selectedDateTime = this.datepicker;
    }

    formData.append('Schedule.firstName', this.firstName);
    formData.append('Schedule.lastName', this.lastName);
    formData.append('Schedule.email', this.email);
    formData.append('Schedule.phoneNumber', this.phoneNumber);
    formData.append('Schedule.haircutId', this.selectedHaircut);
    formData.append('Schedule.time', this.selectedAppointment!);

    if (this.selectedBarberId) {
      formData.append('Schedule.barberId', this.selectedBarberId);
    }

    this.barberService.createSchedule(formData).subscribe({
      next: (response) => {
        console.log('Uspešno zakazano:', response);
        this.router.navigate(['/dashboard']);
        
      },
      error: (error: HttpErrorResponse) => {
        showError('Greška prilikom zakazivanja: ' + error.error.message);
        console.error('Greška prilikom zakazivanja:', error.error.message);
      }
    });

  }


  onSubmitSelectedOwner(): void {
    const formData = new FormData();
    formData.append('AssignCompanyOwnerDto.ApplicationUserId', this.selectedOwner);
    if (this.companyId) {
      formData.append('AssignCompanyOwnerDto.CompanyId', this.companyId);
    }

    showConfirm('Da li ste sigurni da želite dodeliti vlasnika kompanije?', () => {
      this.authService.assignCompanyOwnerToCompany(formData).subscribe({
        next: (response) => {
          showSuccess('Uspešno dodeljen vlasnik kompanije');
          console.log('Uspešno dodeljen vlasnik kompanije:', response);
        },
        error: (error: HttpErrorResponse) => {
          showError('Greška prilikom dodele vlasnika kompanije' + error.message);
          console.error('Greška prilikom dodele vlasnika kompanije:', error);
        }
      });
    })
  }

}
