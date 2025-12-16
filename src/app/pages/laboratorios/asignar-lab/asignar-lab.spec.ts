import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import AsignarLab from './asignar-lab';

describe('AsignarLab', () => {
  let component: AsignarLab;
  let fixture: ComponentFixture<AsignarLab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarLab, RouterTestingModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarLab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener listas iniciales', () => {
    expect(component.laboratorios.length).toBeGreaterThan(0);
    expect(component.usuarios.length).toBeGreaterThan(0);
  });

  it('debería asignar laboratorio', () => {
    spyOn(window, 'alert');
    component.laboratorioSeleccionado = 'Lab Central';
    component.usuario = 'Usuario 1';

    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;
    component.asignarLab(form);

    expect(window.alert).toHaveBeenCalled();
    expect(form.reset).toHaveBeenCalled();
  });

  it('no debería asignar si el formulario es inválido', () => {
    spyOn(window, 'alert');
    const form = { valid: false, reset: jasmine.createSpy('reset') } as any;
    component.asignarLab(form);

    expect(window.alert).not.toHaveBeenCalled();
    expect(form.reset).not.toHaveBeenCalled();
  });
});
