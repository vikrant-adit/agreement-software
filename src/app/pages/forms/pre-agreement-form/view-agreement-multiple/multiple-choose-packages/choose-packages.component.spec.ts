import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePackagesComponent } from './choose-packages.component';

describe('ChoosePackagesComponent', () => {
  let component: ChoosePackagesComponent;
  let fixture: ComponentFixture<ChoosePackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoosePackagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoosePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
