import { TestBed } from '@angular/core/testing';

import { AuditInterceptorService } from './audit-interceptor.service';

describe('AuditInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditInterceptorService = TestBed.get(AuditInterceptorService);
    expect(service).toBeTruthy();
  });
});
