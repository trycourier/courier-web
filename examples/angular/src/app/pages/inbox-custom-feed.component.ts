import { Component, OnInit } from '@angular/core';
import {
  CourierInboxComponent,
  CourierService,
  type CourierInboxFeed,
} from '@trycourier/courier-angular';
import customInboxIcon from '../../assets/custom-inbox.svg?raw';
import jobsIcon from '../../assets/jobs-icon.svg?raw';
import postsIcon from '../../assets/posts-icon.svg?raw';
import mentionsIcon from '../../assets/mentions-icon.svg?raw';

@Component({
  selector: 'app-inbox-custom-feed',
  standalone: true,
  imports: [CourierInboxComponent],
  template: `
    <courier-inbox [feeds]="feeds"></courier-inbox>
  `,
})
export class InboxCustomFeedComponent implements OnInit {
  constructor(private courier: CourierService) {}

  readonly feeds: CourierInboxFeed[] = [
    {
      feedId: 'all',
      title: 'All',
      iconSVG: customInboxIcon,
      tabs: [{ datasetId: 'all', title: 'All', filter: {} }],
    },
    {
      feedId: 'jobs',
      title: 'Jobs',
      iconSVG: jobsIcon,
      tabs: [{ datasetId: 'jobs', title: 'Jobs', filter: { tags: ['job'] } }],
    },
    {
      feedId: 'my-posts',
      title: 'My Posts',
      iconSVG: postsIcon,
      tabs: [
        { datasetId: 'all-my-posts', title: 'All', filter: {} },
        { datasetId: 'comments', title: 'Comments', filter: { tags: ['comment'] } },
        { datasetId: 'reactions', title: 'Reactions', filter: { tags: ['reaction'] } },
        { datasetId: 'reposts', title: 'Reposts', filter: { tags: ['repost'] } },
      ],
    },
    {
      feedId: 'mentions',
      title: 'Mentions',
      iconSVG: mentionsIcon,
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
