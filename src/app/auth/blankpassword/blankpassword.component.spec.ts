import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankpasswordComponent } from './blankpassword.component';

describe('BlankpasswordComponent', () => {
  let component: BlankpasswordComponent;
  let fixture: ComponentFixture<BlankpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlankpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
