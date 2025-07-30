import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAppointmentsManagementComponent } from './dashboard-appointments-management.component';

describe('DashboardAppointmentsManagementComponent', () => {
  let component: DashboardAppointmentsManagementComponent;
  let fixture: ComponentFixture<DashboardAppointmentsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAppointmentsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAppointmentsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
