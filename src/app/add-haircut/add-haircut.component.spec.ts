import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHaircutComponent } from './add-haircut.component';

describe('AddHaircutComponent', () => {
  let component: AddHaircutComponent;
  let fixture: ComponentFixture<AddHaircutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHaircutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHaircutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
