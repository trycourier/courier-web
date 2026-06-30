import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type ExampleCard = {
  to: string;
  title: string;
  description: string;
};

@Component({
  selector: 'app-examples',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main style="max-width: 1000px; margin: 0 auto; padding: 24px 16px 40px; box-sizing: border-box;">
      <header style="margin-bottom: 24px; border-bottom: 1px solid #dddddd; padding-bottom: 12px;">
        <h1 style="margin: 0 0 6px; font-size: 22px;">
          Courier Angular Inbox &amp; Toast Examples
        </h1>
        <p style="margin: 0; font-size: 13px; color: #555555;">
          Explore inbox, popup, toast, and Angular-only examples built with
          <code>&#64;trycourier/courier-angular</code>.
        </p>
      </header>

      <section style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 0;">
          <a *ngFor="let card of inboxExamples" [routerLink]="card.to" [ngStyle]="cardStyle">
            <strong style="display: block; font-size: 14px; margin-bottom: 6px;">{{ card.title }}</strong>
            <span style="display: block; color: #666666;">{{ card.description }}</span>
          </a>
        </div>

        <div style="flex: 1; min-width: 0;">
          <a *ngFor="let card of popupExamples" [routerLink]="card.to" [ngStyle]="cardStyle">
            <strong style="display: block; font-size: 14px; margin-bottom: 6px;">{{ card.title }}</strong>
            <span style="display: block; color: #666666;">{{ card.description }}</span>
          </a>
        </div>

        <div style="flex: 1; min-width: 0;">
          <a *ngFor="let card of angularOnlyExamples" [routerLink]="card.to" [ngStyle]="cardStyle">
            <strong style="display: block; font-size: 14px; margin-bottom: 6px;">{{ card.title }}</strong>
            <span style="display: block; color: #666666;">{{ card.description }}</span>
          </a>
        </div>

        <div style="flex: 1; min-width: 0;">
          <a *ngFor="let card of toastExamples" [routerLink]="card.to" [ngStyle]="cardStyle">
            <strong style="display: block; font-size: 14px; margin-bottom: 6px;">{{ card.title }}</strong>
            <span style="display: block; color: #666666;">{{ card.description }}</span>
          </a>
        </div>

        <div style="flex: 1; min-width: 0;">
          <a *ngFor="let card of preferencesExamples" [routerLink]="card.to" [ngStyle]="cardStyle">
            <strong style="display: block; font-size: 14px; margin-bottom: 6px;">{{ card.title }}</strong>
            <span style="display: block; color: #666666;">{{ card.description }}</span>
          </a>
        </div>
      </section>
    </main>
  `,
})
export class ExamplesComponent {
  readonly cardStyle = {
    display: 'block',
    padding: '10px 12px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #dddddd',
    textDecoration: 'none',
    color: 'inherit',
    background: '#fafafa',
    fontSize: '13px',
  };

  readonly inboxExamples: ExampleCard[] = [
    { to: '/examples/inbox', title: 'Inbox — Default', description: 'Minimal inbox with default styling and message click handling.' },
    { to: '/examples/inbox-custom-feed', title: 'Inbox — Custom Feed', description: 'Inbox configured with multiple custom feeds (All, Jobs, My Posts, Mentions).' },
    { to: '/examples/inbox-custom-tabs', title: 'Inbox — Custom Tabs', description: 'Inbox with a single feed containing multiple filtering tabs (All, Unread, Read, Important, Archived).' },
    { to: '/examples/inbox-custom-height', title: 'Inbox — Custom Height', description: 'Inbox constrained to a custom height with a tailored layout.' },
    { to: '/examples/inbox-theme', title: 'Inbox — Themed', description: 'Inbox themed via Angular with Poppins typography and accent colors.' },
    { to: '/examples/inbox-header', title: 'Inbox — Custom Header', description: 'Inbox with a fully custom header driven by feed and tab state.' },
    { to: '/examples/inbox-list-item', title: 'Inbox — Custom List Item', description: 'Inbox rendering each message as a custom list item component.' },
    { to: '/examples/inbox-actions', title: 'Inbox — Actions', description: 'Inbox with custom header action menu using Courier Angular.' },
  ];

  readonly popupExamples: ExampleCard[] = [
    { to: '/examples/inbox-popup-menu', title: 'Popup — Default Menu Button', description: 'Popup inbox menu with default appearance and interactions.' },
    { to: '/examples/inbox-popup-menu-custom-feed', title: 'Popup — Custom Feed', description: 'Popup inbox menu with multiple custom feeds and tabs (All, Jobs, My Posts, Mentions, Other).' },
    { to: '/examples/inbox-popup-menu-button', title: 'Popup — Custom Menu Button', description: 'Popup inbox menu using a fully custom trigger button.' },
    { to: '/examples/inbox-popup-list-item', title: 'Popup — Custom List Item', description: 'Popup rendering messages with a custom list item component.' },
    { to: '/examples/inbox-popup-menu-theme', title: 'Popup — Themed', description: 'Popup inbox menu themed via Angular with Poppins typography and accent colors.' },
    { to: '/examples/inbox-popup-everything-else', title: 'Popup — Custom States', description: 'Popup with custom loading, empty, error, and pagination states.' },
    { to: '/examples/alignment', title: 'Popup — Alignment & Position', description: 'Demonstrates alignment and positioning options for the popup menu.' },
  ];

  readonly angularOnlyExamples: ExampleCard[] = [
    { to: '/examples/element-ref', title: 'Element Ref', description: 'Access the underlying inbox element via component refs.' },
    { to: '/examples/markdown', title: 'Markdown List Item', description: 'Render inbox messages using a custom markdown list item component.' },
    { to: '/examples/hooks', title: 'Service-only Usage', description: 'Use the Courier Angular service directly without UI components.' },
  ];

  readonly toastExamples: ExampleCard[] = [
    { to: '/examples/toast-basic', title: 'Toast — Basic', description: 'Toast notifications using the default Courier Toast theme.' },
    { to: '/examples/toast-themed', title: 'Toast — Themed', description: 'Toast notifications using a Poppins-based custom theme.' },
    { to: '/examples/toast-custom', title: 'Toast — Custom', description: 'Toast notifications rendered with a fully custom Angular template.' },
  ];

  readonly preferencesExamples: ExampleCard[] = [
    { to: '/examples/preferences', title: 'Preferences — Default', description: 'Full notification preferences page with sections, toggles, and channel routing.' },
    { to: '/examples/preferences-styled', title: 'Preferences — Styled', description: 'Preferences themed with Poppins typography and a purple accent color.' },
  ];
}
