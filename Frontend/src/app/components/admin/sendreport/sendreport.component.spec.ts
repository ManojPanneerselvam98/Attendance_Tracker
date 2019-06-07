import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendreportComponent } from './sendreport.component';

describe('SendreportComponent', () => {
  let component: SendreportComponent;
  let fixture: ComponentFixture<SendreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
