import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlComponent } from './pl.component';

describe('PlComponent', () => {
  let component: PlComponent;
  let fixture: ComponentFixture<PlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
