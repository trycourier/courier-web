import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CourierInboxComponent,
  CourierService,
  type CourierInboxListItemFactoryProps,
} from '@trycourier/courier-angular';

@Component({
  selector: 'app-custom-list-items',
  standalone: true,
  imports: [CommonModule, CourierInboxComponent],
  template: `
    <courier-inbox>
      <ng-template #listItem let-props>
        <pre
          (click)="onClick(props)"
          style="padding: 24px; border-bottom: 1px solid #e0e0e0; margin: 0;"
        >{{ { message: props?.message, index: props?.index } | json }}</pre>
      </ng-template>
    </courier-inbox>
  `,
})
export class CustomListItemsComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }

  onClick(props: CourierInboxListItemFactoryProps): void {
    alert(JSON.stringify({ message: props?.message, index: props?.index }, null, 2));
  }
}
