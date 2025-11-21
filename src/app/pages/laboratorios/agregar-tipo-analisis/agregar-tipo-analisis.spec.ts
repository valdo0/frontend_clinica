import { ComponentFixture, TestBed } from '@angular/core/testing';
import AgregarTipoAnalisis from './agregar-tipo-analisis';

describe('AgregarTipoAnalisis', () => {
  let component: AgregarTipoAnalisis;
  let fixture: ComponentFixture<AgregarTipoAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarTipoAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarTipoAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
