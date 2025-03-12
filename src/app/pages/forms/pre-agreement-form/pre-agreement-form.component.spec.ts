import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAgreementFormComponent } from './pre-agreement-form.component';

describe('PreAgreementFormComponent', () => {
  let component: PreAgreementFormComponent;
  let fixture: ComponentFixture<PreAgreementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreAgreementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreAgreementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
