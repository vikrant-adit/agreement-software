import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeDemoComponent } from './upgrade-demo.component';

describe('UpgradeDemoComponent', () => {
  let component: UpgradeDemoComponent;
  let fixture: ComponentFixture<UpgradeDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
