import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasEncuestaComponent } from './estadisticas-encuesta.component';

describe('EstadisticasEncuestaComponent', () => {
  let component: EstadisticasEncuestaComponent;
  let fixture: ComponentFixture<EstadisticasEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasEncuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
