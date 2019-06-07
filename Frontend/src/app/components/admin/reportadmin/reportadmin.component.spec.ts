import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportadminComponent } from './reportadmin.component';

describe('ReportadminComponent', () => {
  let component: ReportadminComponent;
  let fixture: ComponentFixture<ReportadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
