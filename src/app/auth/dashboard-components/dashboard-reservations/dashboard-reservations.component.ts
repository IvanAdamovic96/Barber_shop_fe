import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { showError } from '../../../../utils';
import { UserAppointment } from '../../../models/user-appointment.config';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-dashboard-reservations',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-reservations.component.html',
  styleUrl: './dashboard-reservations.component.css'
})
export class DashboardReservationsComponent implements OnInit {

  userAppointments: UserAppointment[] = [];
  isLoading: boolean = true;
  userId: string | null = null;

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    if (this.userId) {
      this.loadUserAppointments(this.userId);
    } else {
      showError('Korisnički ID nije pronađen!');
      this.isLoading = false;
    }
  }

  loadUserAppointments(userId: string): void {
    this.isLoading = true;
    this.authService.getAllAppointmentsByUserId(userId).subscribe({
      next: (appointments: UserAppointment[]) => {
        this.userAppointments = appointments.sort((a, b) => {
          return new Date(a.time).getTime() - new Date(b.time).getTime();
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Greška pri učitavanju korisničkih termina:', error);
        showError('Došlo je do greške prilikom učitavanja vaših termina.');
        this.isLoading = false;
      }
    });
  }


  cancelAppointment(appointmentId: string): void{

  }
  // Otkazi termin - opciono
  /* cancelAppointment(appointmentId: string): void {
    if (confirm('Da li ste sigurni da želite da otkažete ovaj termin?')) {
      this.authService.cancelAppointment(appointmentId).subscribe({
        next: () => {
          showError('Termin uspešno otkazan.');
          if (this.userId) {
            this.loadUserAppointments(this.userId);
          }
        },
        error: (error) => {
          console.error('Greška pri otkazivanju termina:', error);
          showError('Došlo je do greške prilikom otkazivanja termina.');
        }
      });
    }
  } */
}
