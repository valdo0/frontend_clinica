import { ComponentFixture, TestBed } from '@angular/core/testing';

import  ListadoLabs  from './listado-labs';

describe('ListadoLabs', () => {
  let component: ListadoLabs;
  let fixture: ComponentFixture<ListadoLabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoLabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoLabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
