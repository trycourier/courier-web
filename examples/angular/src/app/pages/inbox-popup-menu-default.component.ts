import { Component, OnInit } from '@angular/core';
import { CourierInboxPopupMenuComponent, CourierService } from '@trycourier/courier-angular';

@Component({
  selector: 'app-inbox-popup-menu-default',
  standalone: true,
  imports: [CourierInboxPopupMenuComponent],
  template: `
    <div style="padding: 24px;">
      <courier-inbox-popup-menu></courier-inbox-popup-menu>
    </div>
  `,
})
export class InboxPopupMenuDefaultComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }
}
