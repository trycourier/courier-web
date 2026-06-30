import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  CourierService,
  defaultFeeds,
  type CourierInboxState,
  type CourierUserPreferencesTopic,
  type InboxMessage,
} from '@trycourier/courier-angular';

@Component({
  selector: 'app-hooks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div style="padding: 24px;">Total Unread Count: {{ inbox?.totalUnreadCount }}</div>
      <ul>
        <li
          *ngFor="let message of messages"
          [style.backgroundColor]="message.read ? 'transparent' : 'red'"
        >
          {{ message.title }}
        </li>
      </ul>
      <h3>User Preferences</h3>
      <ul>
        <li *ngFor="let topic of topics">{{ topic.topicName }} — {{ topic.status }}</li>
      </ul>
    </div>
  `,
})
export class HooksComponent implements OnInit, OnDestroy {
  inbox?: CourierInboxState;
  topics: CourierUserPreferencesTopic[] = [];

  private sub?: Subscription;

  constructor(private courier: CourierService) {}

  get messages(): InboxMessage[] {
    return this.inbox?.feeds['all_messages']?.messages ?? [];
  }

  ngOnInit(): void {
    this.sub = this.courier.inbox$.subscribe((state) => (this.inbox = state));

    // Authenticate the user
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });

    // Load the inbox
    this.loadInbox();

    // Load preferences
    this.loadPreferences();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private async loadInbox(): Promise<void> {
    this.courier.registerFeeds(defaultFeeds());

    // Set up socket listener for real-time updates
    await this.courier.listenForUpdates();

    // Load the initial inbox data
    await this.courier.load();

    // Fetch the next page of messages if possible
    await this.fetchNextPageOfMessages();
  }

  private async fetchNextPageOfMessages(): Promise<void> {
    const nextPage = await this.courier.fetchNextPageOfMessages({ datasetId: 'all_messages' });
    if (nextPage && nextPage.canPaginate) {
      await this.fetchNextPageOfMessages();
    }
  }

  private async loadPreferences(): Promise<void> {
    const prefs = await this.courier.getUserPreferences();
    this.topics = prefs.items;
  }
}
