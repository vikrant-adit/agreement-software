import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountSetupComponent } from './user-account-setup.component';

describe('UserAccountSetupComponent', () => {
  let component: UserAccountSetupComponent;
  let fixture: ComponentFixture<UserAccountSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
