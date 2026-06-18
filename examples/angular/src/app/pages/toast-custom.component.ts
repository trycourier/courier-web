import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CourierToastComponent,
  CourierService,
  type InboxAction,
} from '@trycourier/courier-angular';

@Component({
  selector: 'app-toast-custom',
  standalone: true,
  imports: [CommonModule, CourierToastComponent],
  template: `
    <div
      style="margin: 0; min-height: 100vh; padding: 40px; box-sizing: border-box; background: white;
             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;"
    >
      <button type="button" (click)="showToast()">Show custom toast</button>
      <courier-toast>
        <ng-template #toastItem let-props>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="flex: 1; padding: 16px; background: #f6f6fe; border: 1px solid #c6c2ff; border-radius: 8px;">
              <strong style="display: block; margin-bottom: 4px;">{{ props?.message?.title }}</strong>
              <p style="margin: 0; font-size: 14px;">{{ props?.message?.body }}</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; min-width: 100px;">
              <button
                *ngFor="let action of props?.message?.actions ?? []"
                (click)="openAction(action)"
                style="padding: 8px 12px; background: #f6f6fe; border: 1px solid #c6c2ff; border-radius: 8px;"
              >
                {{ action.content }}
              </button>
            </div>
          </div>
        </ng-template>
      </courier-toast>
    </div>
  `,
})
export class ToastCustomComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }

  showToast(): void {
    this.courier.addToastMessage({
      messageId: 'custom-1',
      title: '📸 New photos from Fred L.',
      body: 'Fred shared 4 photos.',
      actions: [{ content: 'See more' }, { content: 'Mark read' }],
    });
  }

  openAction(action: InboxAction): void {
    if (action.href) {
      window.open(action.href);
    }
  }
}
