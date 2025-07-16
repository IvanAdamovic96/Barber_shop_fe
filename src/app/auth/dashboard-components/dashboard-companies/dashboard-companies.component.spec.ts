import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCompaniesComponent } from './dashboard-companies.component';

describe('DashboardCompaniesComponent', () => {
  let component: DashboardCompaniesComponent;
  let fixture: ComponentFixture<DashboardCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCompaniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
