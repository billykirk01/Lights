import { TestBed } from '@angular/core/testing';

import { LifxService } from './lifx.service';

describe('LifxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LifxService = TestBed.get(LifxService);
    expect(service).toBeTruthy();
  });
});
