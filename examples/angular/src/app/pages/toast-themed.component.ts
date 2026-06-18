import { Component, OnInit } from '@angular/core';
import {
  CourierToastComponent,
  CourierService,
  type CourierToastTheme,
} from '@trycourier/courier-angular';
import ToastIcon from '../../toast-icon.svg?raw';

@Component({
  selector: 'app-toast-themed',
  standalone: true,
  imports: [CourierToastComponent],
  template: `
    <div
      style="margin: 0; min-height: 100vh; padding: 40px; box-sizing: border-box; background: white;
             font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;"
    >
      <button type="button" (click)="showToast()">Show themed toast</button>
      <courier-toast [lightTheme]="themedToast"></courier-toast>
    </div>
  `,
})
export class ToastThemedComponent implements OnInit {
  constructor(private courier: CourierService) {}

  readonly themedToast: CourierToastTheme = {
    item: {
      title: { color: '#6366f1', weight: '600', family: 'Poppins', size: '15px' },
      body: { family: 'Poppins', size: '14px' },
      actions: { font: { family: 'Poppins', size: '13px', weight: '500' } },
      backgroundColor: '#edeefc',
      border: '1px solid #cdd1ff',
      borderRadius: '15px',
      icon: { svg: ToastIcon },
    },
  };

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }

  showToast(): void {
    this.courier.addToastMessage({
      messageId: 'themed-1',
      title: '📸 New photos from Fred L.',
      body: 'Fred shared 4 photos.',
      actions: [{ content: 'See more' }, { content: 'Mark read' }],
    });
  }
}
