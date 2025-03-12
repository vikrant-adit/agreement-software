import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InPersonLeadFormComponent } from './in-person-lead-form.component';

describe('InPersonLeadFormComponent', () => {
  let component: InPersonLeadFormComponent;
  let fixture: ComponentFixture<InPersonLeadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InPersonLeadFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InPersonLeadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
