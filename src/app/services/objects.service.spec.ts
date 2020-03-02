import { TestBed } from '@angular/core/testing';

import { ObjectsService } from './objects.service';

describe('ObjectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectsService = TestBed.get(ObjectsService);
    expect(service).toBeTruthy();
  });
});
