import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgreementComponent } from './view-agreement.component';

describe('ViewAgreementComponent', () => {
  let component: ViewAgreementComponent;
  let fixture: ComponentFixture<ViewAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAgreementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
