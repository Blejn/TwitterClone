import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersSectionComponent } from './all-users-section.component';

describe('AllUsersSectionComponent', () => {
  let component: AllUsersSectionComponent;
  let fixture: ComponentFixture<AllUsersSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllUsersSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllUsersSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
