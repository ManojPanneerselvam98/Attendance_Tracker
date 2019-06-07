import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentadminComponent } from './absentadmin.component';

describe('AbsentadminComponent', () => {
  let component: AbsentadminComponent;
  let fixture: ComponentFixture<AbsentadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsentadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsentadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
