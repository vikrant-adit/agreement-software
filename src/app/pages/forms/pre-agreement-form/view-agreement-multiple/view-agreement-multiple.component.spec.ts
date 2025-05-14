import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgreementMultipleComponent } from './view-agreement-multiple.component';

describe('ViewAgreementMultipleComponent', () => {
  let component: ViewAgreementMultipleComponent;
  let fixture: ComponentFixture<ViewAgreementMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAgreementMultipleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAgreementMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
