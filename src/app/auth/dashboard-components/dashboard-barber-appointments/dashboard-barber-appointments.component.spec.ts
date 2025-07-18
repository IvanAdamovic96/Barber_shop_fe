import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBarberAppointmentsComponent } from './dashboard-barber-appointments.component';

describe('DashboardBarberAppointmentsComponent', () => {
  let component: DashboardBarberAppointmentsComponent;
  let fixture: ComponentFixture<DashboardBarberAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBarberAppointmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardBarberAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
