import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgisterUserComponent } from './resgister-user.component';

describe('ResgisterUserComponent', () => {
  let component: ResgisterUserComponent;
  let fixture: ComponentFixture<ResgisterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResgisterUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResgisterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
