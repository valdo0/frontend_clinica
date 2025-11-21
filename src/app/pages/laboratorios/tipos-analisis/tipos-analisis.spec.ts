import { ComponentFixture, TestBed } from '@angular/core/testing';
import TiposAnalisis from './tipos-analisis';

describe('TiposAnalisis', () => {
  let component: TiposAnalisis;
  let fixture: ComponentFixture<TiposAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
