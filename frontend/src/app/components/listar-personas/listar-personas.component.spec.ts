import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEncuestasComponent } from './listar-personas.component';

describe('ListarEncuestasComponent', () => {
  let component: ListarEncuestasComponent;
  let fixture: ComponentFixture<ListarEncuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarEncuestasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarEncuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
