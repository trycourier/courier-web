import { Component, OnInit } from '@angular/core';
import { CourierInboxPopupMenuComponent, CourierService } from '@trycourier/courier-angular';

@Component({
  selector: 'app-custom-menu-button',
  standalone: true,
  imports: [CourierInboxPopupMenuComponent],
  template: `
    <div style="padding: 24px;">
      <courier-inbox-popup-menu>
        <ng-template #menuButton let-props>
          <button>Open the Inbox Popup. Total unread count: {{ props?.totalUnreadCount ?? 0 }}</button>
        </ng-template>
      </courier-inbox-popup-menu>
    </div>
  `,
})
export class CustomMenuButtonComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }
}
