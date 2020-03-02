import { TestBed } from '@angular/core/testing';

import { MbmDirFusayService } from './mbm-dir-fusay.service';

describe('MbmDirFusayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MbmDirFusayService = TestBed.get(MbmDirFusayService);
    expect(service).toBeTruthy();
  });
});
