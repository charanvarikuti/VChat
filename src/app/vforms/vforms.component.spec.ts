import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VformsComponent } from './vforms.component';

describe('VformsComponent', () => {
  let component: VformsComponent;
  let fixture: ComponentFixture<VformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VformsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
