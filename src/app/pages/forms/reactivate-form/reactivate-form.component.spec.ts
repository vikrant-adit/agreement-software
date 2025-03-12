import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateFormComponent } from './reactivate-form.component';

describe('ReactivateFormComponent', () => {
  let component: ReactivateFormComponent;
  let fixture: ComponentFixture<ReactivateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactivateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactivateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
