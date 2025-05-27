import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacakgeSelectionComponent } from './pacakge-selection.component';

describe('PacakgeSelectionComponent', () => {
  let component: PacakgeSelectionComponent;
  let fixture: ComponentFixture<PacakgeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacakgeSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacakgeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
