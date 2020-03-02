import { TestBed } from '@angular/core/testing';

import { FautService } from './faut.service';

describe('FautService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FautService = TestBed.get(FautService);
    expect(service).toBeTruthy();
  });
});
