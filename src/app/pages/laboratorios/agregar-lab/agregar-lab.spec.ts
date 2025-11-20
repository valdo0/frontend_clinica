import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarLab } from './agregar-lab';

describe('AgregarLab', () => {
  let component: AgregarLab;
  let fixture: ComponentFixture<AgregarLab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarLab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarLab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
