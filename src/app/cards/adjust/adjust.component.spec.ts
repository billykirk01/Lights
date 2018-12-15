/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdjustComponent } from './adjust.component';

describe('AdjustComponent', () => {
  let component: AdjustComponent;
  let fixture: ComponentFixture<AdjustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
