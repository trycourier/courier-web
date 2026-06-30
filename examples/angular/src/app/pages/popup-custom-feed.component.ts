import { Component, OnInit } from '@angular/core';
import {
  CourierInboxPopupMenuComponent,
  CourierService,
  type CourierInboxFeed,
} from '@trycourier/courier-angular';

@Component({
  selector: 'app-popup-custom-feed',
  standalone: true,
  imports: [CourierInboxPopupMenuComponent],
  template: `
    <div style="padding: 24px;">
      <courier-inbox-popup-menu [feeds]="feeds"></courier-inbox-popup-menu>
    </div>
  `,
})
export class PopupCustomFeedComponent implements OnInit {
  constructor(private courier: CourierService) {}

  readonly feeds: CourierInboxFeed[] = [
    {
      feedId: 'all',
      title: 'All',
      tabs: [{ datasetId: 'all', title: 'All', filter: {} }],
    },
    {
      feedId: 'jobs',
      title: 'Jobs',
      tabs: [{ datasetId: 'jobs', title: 'Jobs', filter: { tags: ['job'] } }],
    },
    {
      feedId: 'my-posts',
      title: 'My Posts',
      tabs: [
        { datasetId: 'all-my-posts', title: 'All', filter: { tags: ['my_post'] } },
        { datasetId: 'comments', title: 'Comments', filter: { tags: ['comment'] } },
        { datasetId: 'reactions', title: 'Reactions', filter: { tags: ['reaction'] } },
        { datasetId: 'reposts', title: 'Reposts', filter: { tags: ['repost'] } },
      ],
    },
    {
      feedId: 'mentions',
      title: 'Mentions',
      tabs: [{ datasetId: 'mentions', title: 'Mentions', filter: { tags: ['mention'] } }],
    },
  ];

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }
}
