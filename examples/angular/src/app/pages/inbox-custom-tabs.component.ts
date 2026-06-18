import { Component, OnInit } from '@angular/core';
import {
  CourierInboxComponent,
  CourierService,
  type CourierInboxFeed,
} from '@trycourier/courier-angular';

@Component({
  selector: 'app-inbox-custom-tabs',
  standalone: true,
  imports: [CourierInboxComponent],
  template: `
    <courier-inbox [feeds]="feeds"></courier-inbox>
  `,
})
export class InboxCustomTabsComponent implements OnInit {
  constructor(private courier: CourierService) {}

  // Single feed with multiple tabs for filtering
  readonly feeds: CourierInboxFeed[] = [
    {
      feedId: 'notifications',
      title: 'Notifications',
      tabs: [
        { datasetId: 'all-notifications', title: 'All', filter: {} },
        { datasetId: 'unread-notifications', title: 'Unread', filter: { status: 'unread' } },
        { datasetId: 'read-notifications', title: 'Read', filter: { status: 'read' } },
        { datasetId: 'important', title: 'Important', filter: { tags: ['important'] } },
        { datasetId: 'archived', title: 'Archived', filter: { archived: true } },
      ],
    },
  ];

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }
}
