import { Component, OnInit } from '@angular/core';
import { NotificationsStoreService } from 'src/app/services/notifications-store.service';

@Component({
  selector: 'app-sender-component',
  templateUrl: './sender-component.component.html',
  styleUrls: ['./sender-component.component.css']
})
export class SenderComponentComponent implements OnInit {
  public notification = { note: '' };

  constructor(private notificationsStore: NotificationsStoreService) {}

  ngOnInit() {}

  public send() {
    this.notificationsStore.dispatch(this.notification.note);
  }
}
