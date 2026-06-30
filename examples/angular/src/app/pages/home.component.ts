import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CourierInboxComponent,
  CourierService,
  type CourierInboxListItemFactoryProps,
} from '@trycourier/courier-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CourierInboxComponent],
  template: `
    <div style="padding: 24px;">
      <div style="margin-bottom: 24px;">
        <a routerLink="/examples" style="color: #0066cc; text-decoration: underline;">
          View All Examples →
        </a>
      </div>
      <courier-inbox (messageClick)="handleMessageClick($event)"></courier-inbox>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }

  handleMessageClick(props: CourierInboxListItemFactoryProps): void {
    alert(JSON.stringify(props, null, 2));
  }
}
