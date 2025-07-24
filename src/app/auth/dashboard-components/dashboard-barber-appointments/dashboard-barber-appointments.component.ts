import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarEvent, CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { showError } from '../../../../utils';
import { BarberService } from '../../../services/barber.service';
import { addMinutes } from 'date-fns';
import { AuthService } from '../../../services/auth.service';


interface Appointment {
  appointmentId: string;
  barberId: string;
  time: string; // Ovo je vaš startTime
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  haircutName: string;
  applicationUserId: string;
}

@Component({
  selector: 'app-dashboard-barber-appointments',
  imports: [CommonModule, FormsModule, CalendarModule],
  templateUrl: './dashboard-barber-appointments.component.html',
  styleUrl: './dashboard-barber-appointments.component.css'
})
export class DashboardBarberAppointmentsComponent {

  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  barberId: string = '';
  CalendarView: typeof CalendarView = CalendarView;
  //event: Event | undefined;

  constructor(private barberService: BarberService, private authService: AuthService) { }

  ngOnInit(): void {
    this.barberId = this.authService.getBarberId();

    this.loadReservations();
  }

  loadReservations(): void {
    if (!this.barberId) {
      showError('Barber ID nije postavljen. Molimo vas da odaberete brijača.');
      console.warn('Barber ID nije dostupan za učitavanje rezervacija.');
      return;
    }

    this.barberService.getAllUsedAppointmentsByBarberId(this.barberId).subscribe({
      next: (appointments: Appointment[]) => {
        this.events = appointments.map(app => {
          const startTime = new Date(app.time);
          // Izračunavamo endTime dodavanjem 30 minuta (ili drugog fiksnog trajanja)
          // Preporučeno: Dobićete trajanje šišanja sa bekenda uz haircutName
          const endTime = addMinutes(startTime, 30); // Pretpostavka: svaki termin traje 30 minuta

          return {
            id: app.appointmentId,
            start: startTime,
            end: endTime,
            title: `${app.firstName} ${app.lastName} - ${app.haircutName}`,
            color: {
              primary: '#1e90ff',
              secondary: '#D1E8FF',
            },
            meta: {
              barberId: app.barberId,
              email: app.email,
              phoneNumber: app.phoneNumber,
              haircutName: app.haircutName,
              applicationUserId: app.applicationUserId
            }
          };
        });
      },
      error: (error) => {
        console.error('Greška pri učitavanju termina:', error);
        showError('Došlo je do greške prilikom učitavanja termina.');
      }
    });
  }


  setView(view: CalendarView) {
    this.view = view;
  }

  viewDateChanged(date: Date) {
    this.viewDate = date;
  
  }

  // Koristite ovu metodu za direktan pristup CalendarEvent-u
  handleEvent(action: string, event: CalendarEvent): void {
    console.log('Akcija:', action, 'Kliknuti termin:', event);
    // Primer: Prikaz detalja termina u konzoli
    console.log('Detalji klijenta:', event.meta.firstName, event.meta.lastName);
    console.log('Usluga:', event.meta.haircutName);
    console.log('Email:', event.meta.email);
    console.log('Telefon:', event.meta.phoneNumber);
    // Ovde možete implementirati otvaranje modala sa detaljima termina
  }

  // Metoda za omotavanje koja prima sirovi događaj (za dijagnostiku)
  handleEventWrapper($event: any): void {
    console.log('Raw $event from eventClick:', $event);

    // Na osnovu iskustva sa angular-calendar, $event bi trebalo da bude objekat sa .event property-jem
    if ($event && $event.event) {
      this.handleEvent('Clicked', $event.event as CalendarEvent); // Castovanje radi sigurnosti
    } else {
      console.error('Neočekivani tip događaja iz eventClick. Očekivano je { event: CalendarEvent }. Primljeno:', $event);
      // Opciono: Možete ovde baciti grešku ili se nositi sa neočekivanim događajem
    }
  }

  goToToday(): void {
    this.viewDate = new Date();
    if (typeof this.loadReservations === 'function') {
      this.loadReservations();
    }
  }

}
