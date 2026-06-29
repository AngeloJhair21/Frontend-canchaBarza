import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilReservas } from './perfil-reservas';

describe('PerfilReservas', () => {
  let component: PerfilReservas;
  let fixture: ComponentFixture<PerfilReservas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilReservas],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilReservas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
