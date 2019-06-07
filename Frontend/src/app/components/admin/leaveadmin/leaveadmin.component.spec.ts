import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveadminComponent } from './leaveadmin.component';

describe('LeaveadminComponent', () => {
  let component: LeaveadminComponent;
  let fixture: ComponentFixture<LeaveadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
