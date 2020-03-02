import { TestBed } from '@angular/core/testing';

import { PersonaeventService } from './personaevent.service';

describe('PersonaeventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonaeventService = TestBed.get(PersonaeventService);
    expect(service).toBeTruthy();
  });
});
