import { Component, OnInit } from '@angular/core';
import {
  CourierInboxComponent,
  CourierService,
  type CourierInboxListItemFactoryProps,
  type CourierInboxListItemActionFactoryProps,
} from '@trycourier/courier-angular';

@Component({
  selector: 'app-inbox-actions',
  standalone: true,
  imports: [CourierInboxComponent],
  template: `
    <courier-inbox
      (messageClick)="handleMessageClick($event)"
      (messageActionClick)="handleMessageActionClick($event)"
      (messageLongPress)="handleMessageLongPress($event)"
    ></courier-inbox>
  `,
})
export class InboxActionsComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }

  handleMessageClick({ message, index }: CourierInboxListItemFactoryProps): void {
    alert('Message clicked at index ' + index + ':\n' + JSON.stringify(message, null, 2));
  }

  handleMessageActionClick({ message, action, index }: CourierInboxListItemActionFactoryProps): void {
    alert(
      'Message action clicked at index ' + index + ':\n' +
      'Action: ' + JSON.stringify(action, null, 2) + '\n' +
      'Message: ' + JSON.stringify(message, null, 2)
    );
  }

  handleMessageLongPress({ message, index }: CourierInboxListItemFactoryProps): void {
    alert('Message long pressed at index ' + index + ':\n' + JSON.stringify(message, null, 2));
  }
}
