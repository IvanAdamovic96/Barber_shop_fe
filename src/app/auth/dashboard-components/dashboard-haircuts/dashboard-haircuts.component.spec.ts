import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHaircutsComponent } from './dashboard-haircuts.component';

describe('DashboardHaircutsComponent', () => {
  let component: DashboardHaircutsComponent;
  let fixture: ComponentFixture<DashboardHaircutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHaircutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardHaircutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
