import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarEncuestaComponent } from './listar-encuesta.component';

describe('ActualizarEncuestaComponent', () => {
  let component: ActualizarEncuestaComponent;
  let fixture: ComponentFixture<ActualizarEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarEncuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
