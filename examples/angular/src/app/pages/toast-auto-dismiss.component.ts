import { Component, OnInit } from '@angular/core';
import { CourierToastComponent, CourierService } from '@trycourier/courier-angular';

const AUTO_DISMISS_TIMEOUT_MS = 6000;
const STACK_STAGGER_MS = 400;

@Component({
  selector: 'app-toast-auto-dismiss',
  standalone: true,
  imports: [CourierToastComponent],
  template: `
    <div
      style="margin: 0; min-height: 100vh; padding: 40px; box-sizing: border-box; background: white;
             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;"
    >
      <h1 style="margin: 0 0 6px; font-size: 22px;">Toast — Auto-dismiss timer</h1>
      <p style="margin: 0 0 20px; font-size: 13px; color: #555555; max-width: 560px;">
        Each toast dismisses itself after {{ autoDismissTimeoutMs / 1000 }} seconds, counted
        down by the timer bar across the top of the toast. Only the toast on top of the stack
        counts down — the ones behind it freeze until they surface, so a burst of toasts drains
        one at a time instead of expiring together. Hover the stack to freeze every countdown;
        they resume from where they left off once the cursor leaves.
      </p>

      <div style="display: flex; gap: 8px;">
        <button type="button" (click)="showToast()">Show timed toast</button>
        <button type="button" (click)="showToastStack()">Show 3 timed toasts</button>
      </div>

      <courier-toast [autoDismiss]="true" [autoDismissTimeoutMs]="autoDismissTimeoutMs"></courier-toast>
    </div>
  `,
})
export class ToastAutoDismissComponent implements OnInit {
  readonly autoDismissTimeoutMs = AUTO_DISMISS_TIMEOUT_MS;

  /** Toasts are matched to messages by id, so each one needs a distinct id. */
  private count = 0;

  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }

  showToast(): void {
    this.count += 1;
    this.courier.addToastMessage({
      messageId: `auto-dismiss-${this.count}`,
      title: `📸 New photos from Fred L. (${this.count})`,
      body: 'Fred shared 4 photos.',
      actions: [{ content: 'See more' }, { content: 'Mark read' }],
    });
  }

  showToastStack(): void {
    // Space the burst out so the stack visibly builds instead of landing all at once.
    this.showToast();
    setTimeout(() => this.showToast(), STACK_STAGGER_MS);
    setTimeout(() => this.showToast(), STACK_STAGGER_MS * 2);
  }
}
