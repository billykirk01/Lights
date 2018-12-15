/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LocationManagerComponent } from './location-manager.component';

describe('LocationManagerComponent', () => {
  let component: LocationManagerComponent;
  let fixture: ComponentFixture<LocationManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
