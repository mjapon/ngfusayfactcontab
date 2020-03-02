import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsStoreService {
  private notifications = [];
  private notifications$ = new BehaviorSubject<any[]>([]);

  constructor() {}

  public select = () => [...this.notifications];
  public select$ = () => this.notifications$.asObservable();

  public dispatch(notification) {
    this.notifications.push({ ...notification });
    this.notifications$.next(this.select());
  }
}
