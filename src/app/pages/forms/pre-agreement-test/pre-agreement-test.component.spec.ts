import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAgreementTestComponent } from './pre-agreement-test.component';

describe('PreAgreementTestComponent', () => {
  let component: PreAgreementTestComponent;
  let fixture: ComponentFixture<PreAgreementTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreAgreementTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreAgreementTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
