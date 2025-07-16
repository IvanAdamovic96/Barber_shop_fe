import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBarbersComponent } from './dashboard-barbers.component';

describe('DashboardBarbersComponent', () => {
  let component: DashboardBarbersComponent;
  let fixture: ComponentFixture<DashboardBarbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBarbersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardBarbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
