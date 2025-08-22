import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentThankYouComponent } from './payment-thank-you.component';

describe('PaymentThankYouComponent', () => {
  let component: PaymentThankYouComponent;
  let fixture: ComponentFixture<PaymentThankYouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentThankYouComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentThankYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
