import { ComponentFixture, TestBed } from '@angular/core/testing';

import AsignarLab from './asignar-lab';

describe('AsignarLab', () => {
  let component: AsignarLab;
  let fixture: ComponentFixture<AsignarLab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarLab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarLab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
