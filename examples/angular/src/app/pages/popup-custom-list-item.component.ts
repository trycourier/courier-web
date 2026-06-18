import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourierInboxPopupMenuComponent, CourierService } from '@trycourier/courier-angular';

@Component({
  selector: 'app-popup-custom-list-item',
  standalone: true,
  imports: [CommonModule, CourierInboxPopupMenuComponent],
  template: `
    <div style="padding: 24px;">
      <courier-inbox-popup-menu>
        <ng-template #listItem let-props>
          <pre
            style="padding: 24px; border-bottom: 1px solid #e0e0e0; margin: 0;"
          >{{ { message: props?.message, index: props?.index } | json }}</pre>
        </ng-template>
      </courier-inbox-popup-menu>
    </div>
  `,
})
export class PopupCustomListItemComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }
}
