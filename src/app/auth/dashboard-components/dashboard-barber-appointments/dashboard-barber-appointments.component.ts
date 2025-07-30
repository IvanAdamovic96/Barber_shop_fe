import { CommonModule, WeekDay } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarEvent, CalendarModule, CalendarMonthViewDay, CalendarView, CalendarWeekModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { showConfirm, showError, showSuccess } from '../../../../utils';
import { BarberService } from '../../../services/barber.service';
import { addMinutes } from 'date-fns';
import { AuthService } from '../../../services/auth.service';


interface Appointment {
  appointmentId: string;
  barberId: string;
  time: string;
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
export class DashboardBarberAppointmentsComponent implements OnInit, AfterViewInit {

  @ViewChild('dialog', { static: false }) dialog!: ElementRef;
  

  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  barberId: string = '';
  CalendarView: typeof CalendarView = CalendarView;
  selectedEvent: CalendarEvent | null = null;



  constructor(private barberService: BarberService, private authService: AuthService) { }


  ngOnInit(): void {
    this.barberId = this.authService.getBarberId();

    this.loadReservations();
  }

  ngAfterViewInit(): void {
    //console.log('deleteModal nakon view init:', this.deleteModal);
  }

  loadReservations(): void {
    if (!this.barberId) {
      showError('Barber ID nije postavljen. Molimo vas da odaberete brijača.');
      console.warn('Barber ID nije dostupan za učitavanje rezervacija.');
      return;
    }

    this.barberService.getAllUsedAppointmentsByBarberId(this.barberId).subscribe({
      next: (appointments: Appointment[]) => {
        console.log(appointments)
        this.events = appointments.map(app => {

          const startTime = new Date(app.time);
          const endTime = addMinutes(startTime, 0);

          return {
            id: app.appointmentId,
            start: startTime,
            end: endTime,
            title: `${app.firstName} ${app.lastName} - ${app.haircutName}`,
            color: {
              primary: '#1e90ff',
              secondary: '#D1E8FF',
              secondaryText: '#000000'
            },
            meta: {
              barberId: app.barberId,
              email: app.email,
              phoneNumber: app.phoneNumber,
              haircutName: app.haircutName,
              applicationUserId: app.applicationUserId,
              firstName: app.firstName,
              lastName: app.lastName
            },
            draggable: false
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
    console.log('Promenjen datum pregleda:', this.viewDate);
  }

  dayClickedInMonthView(event: { day: CalendarMonthViewDay<any>; sourceEvent: MouseEvent | KeyboardEvent }): void {
    this.viewDate = event.day.date;
    this.view = CalendarView.Day;
  }


  /* Popraviti ovo !!!! */
  dayClickedInWeekView($event: { date: Date } | any) {
    console.log('Kliknut dan u nedeljnom pregledu:', $event);
    if ($event && $event.date) {
      this.viewDate = new Date($event.date);
    } else {
      console.warn('Nije pronađen datum u $event:', $event);
    }
    this.view = CalendarView.Day;
  }


  handleEvent(action: string, event: CalendarEvent): void {
    if (action === 'Clicked') {
      console.log('Kliknut event:', event)
      this.selectedEvent = event;
      setTimeout(() => {
        this.openDeleteConfirmationModal();
      }, 1000);
    }
  }

  // Modal za brisanje termina
  openDeleteConfirmationModal(): void {
    setTimeout(() => {
      if (this.dialog?.nativeElement) {
        this.dialog.nativeElement.showModal()
        /* const modal = new (window as any).bootstrap.Modal(this.dialog.nativeElement);
        modal.showModal(); */
      } else {
        showError('Modal element nije pronađen.');
        console.error('Modal element nije pronađen preko ViewChild.');
      }
    }, 0);
  }


  confirmDeleteAppointment(): void {
    if (this.selectedEvent && this.selectedEvent.id) {
      const appointmentId = this.selectedEvent.id as string;

      this.barberService.deleteAppointment(appointmentId).subscribe({
        next: (response) => {
          showSuccess(response || 'Termin uspešno obrisan.');
          this.closeDeleteConfirmationModal();
          this.loadReservations();
        },
        error: (error) => {
          console.error('Greška pri brisanju termina:', error);
          showError('Došlo je do greške prilikom brisanja termina.');
        }
      });
    }
  }

  closeDeleteConfirmationModal(): void {
    const modalElement = document.getElementById('deleteAppointmentModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }



  handleEventWrapper($event: any): void {
    console.log('Raw $event from eventClick:', $event);
    if ($event || $event.event) {
      this.handleEvent('Clicked', $event.event as CalendarEvent);
    } else {
      console.error('Neočekivani tip događaja iz eventClick. Očekivano je { event: CalendarEvent }. Primljeno:', $event);
    }
  }

  goToToday(): void {
    this.viewDate = new Date();
    if (typeof this.loadReservations === 'function') {
      this.loadReservations();
    }
  }


  deleteAppointment(eventId: string): void {
    console.log(eventId)
    /* showConfirm('Da li želite da obrišete ovaj termin? ', () => {

      this.barberService.deleteAppointment(eventId).subscribe({
        next: () => {
          this.events = this.events.filter(e => e.id !== eventId);
          console.log("Termin uspešno obrisan.");
          this.loadReservations();
        },
        error: (err) => {
          console.error("Greška prilikom brisanja termina", err);
        }
      });
    }) */
  }


}
