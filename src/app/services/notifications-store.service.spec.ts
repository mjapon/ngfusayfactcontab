import { TestBed } from '@angular/core/testing';

import { NotificationsStoreService } from './notifications-store.service';

describe('NotificationsStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationsStoreService = TestBed.get(NotificationsStoreService);
    expect(service).toBeTruthy();
  });
});
