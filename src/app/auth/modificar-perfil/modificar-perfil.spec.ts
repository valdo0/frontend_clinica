import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPerfil } from './modificar-perfil';

describe('ModificarPerfil', () => {
  let component: ModificarPerfil;
  let fixture: ComponentFixture<ModificarPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarPerfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarPerfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
