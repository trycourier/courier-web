import { Component, OnInit } from '@angular/core';
import { CourierToastComponent, CourierService } from '@trycourier/courier-angular';

@Component({
  selector: 'app-toast-basic',
  standalone: true,
  imports: [CourierToastComponent],
  template: `
    <div
      style="margin: 0; min-height: 100vh; padding: 40px; box-sizing: border-box; background: white;
             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;"
    >
      <button type="button" (click)="showToast()">Show basic toast</button>
      <courier-toast></courier-toast>
    </div>
  `,
})
export class ToastBasicComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }

  showToast(): void {
    this.courier.addToastMessage({
      messageId: 'basic-1',
      title: '📸 New photos from Fred L.',
      body: 'Fred shared 4 photos.',
      actions: [{ content: 'See more' }, { content: 'Mark read' }],
    });
  }
}
