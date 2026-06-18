import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import {
  CourierInboxComponent,
  CourierService,
  type CourierInboxHeaderFactoryProps,
  type CourierInboxFeed,
  type CourierInboxElement,
} from '@trycourier/courier-angular';

@Component({
  selector: 'app-custom-header',
  standalone: true,
  imports: [CourierInboxComponent],
  template: `
    <courier-inbox #inbox [feeds]="feeds">
      <ng-template #header let-props>
        <div
          (click)="onHeaderClick(props)"
          style="background: red; font-size: 24px; padding: 24px; width: 100%;"
        >
          {{ selectedFeedId(props) }} - {{ selectedTabId(props) }} - {{ selectedUnreadCount(props) }}
        </div>
      </ng-template>
    </courier-inbox>
  `,
})
export class CustomHeaderComponent implements OnInit, AfterViewInit {
  constructor(private courier: CourierService) {}

  @ViewChild('inbox', { read: ElementRef }) inboxRef?: ElementRef<CourierInboxElement>;

  readonly feeds: CourierInboxFeed[] = [
    {
      feedId: 'inbox',
      title: 'Inbox',
      tabs: [{ datasetId: 'inbox', title: 'Inbox', filter: {} }],
    },
    {
      feedId: 'archive',
      title: 'Archive',
      tabs: [
        { datasetId: 'archive_1', title: 'Archive 1', filter: { archived: true } },
        { datasetId: 'archive_2', title: 'Archive 2', filter: { archived: true } },
      ],
    },
  ];

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }

  ngAfterViewInit(): void {
    // Defer so the SDK component's own ngAfterViewInit (which wires the custom
    // header factory in a microtask) has run before we manipulate the element.
    queueMicrotask(() => {
      const el = this.inboxRef?.nativeElement;
      if (el) {
        // Remove the default header so our custom header renders
        el.removeHeader();

        // Select the feed and tab
        el.selectFeed('archive');
        el.selectTab('archive_2');
      }
    });
  }

  private selectedFeed(props: CourierInboxHeaderFactoryProps) {
    return props?.feeds?.find((feed) => feed.isSelected);
  }

  private selectedTab(props: CourierInboxHeaderFactoryProps) {
    return this.selectedFeed(props)?.tabs.find((tab) => tab.isSelected);
  }

  selectedFeedId(props: CourierInboxHeaderFactoryProps): string {
    return this.selectedFeed(props)?.feedId ?? '';
  }

  selectedTabId(props: CourierInboxHeaderFactoryProps): string {
    return this.selectedTab(props)?.datasetId ?? '';
  }

  selectedUnreadCount(props: CourierInboxHeaderFactoryProps): number {
    return this.selectedTab(props)?.unreadCount ?? 0;
  }

  onHeaderClick(props: CourierInboxHeaderFactoryProps): void {
    alert(JSON.stringify(props, null, 2));
  }
}
