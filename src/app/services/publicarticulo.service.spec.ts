import { TestBed } from '@angular/core/testing';

import { PublicarticuloService } from './publicarticulo.service';

describe('PublicarticuloService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublicarticuloService = TestBed.get(PublicarticuloService);
    expect(service).toBeTruthy();
  });
});
