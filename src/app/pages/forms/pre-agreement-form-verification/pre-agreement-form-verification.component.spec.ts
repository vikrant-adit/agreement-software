import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAgreementFormVerificationComponent } from './pre-agreement-form-verification.component';

describe('PreAgreementFormVerificationComponent', () => {
  let component: PreAgreementFormVerificationComponent;
  let fixture: ComponentFixture<PreAgreementFormVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreAgreementFormVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreAgreementFormVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
