import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAgreementWelcomeComponent } from './pre-agreement-welcome.component';

describe('PreAgreementWelcomeComponent', () => {
  let component: PreAgreementWelcomeComponent;
  let fixture: ComponentFixture<PreAgreementWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreAgreementWelcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreAgreementWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
