import { TestBed } from '@angular/core/testing';

import { ArticulostockService } from './articulostock.service';

describe('ArticulostockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArticulostockService = TestBed.get(ArticulostockService);
    expect(service).toBeTruthy();
  });
});
