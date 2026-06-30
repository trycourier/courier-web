import { Component, OnInit } from '@angular/core';
import { CourierPreferencesComponent, CourierService } from '@trycourier/courier-angular';

@Component({
  selector: 'app-preferences-default',
  standalone: true,
  imports: [CourierPreferencesComponent],
  template: `
    <div
      style="margin: 0; min-height: 100vh; background: #F5F5F5;
             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;"
    >
      <div style="padding: 40px 16px;">
        <courier-preferences></courier-preferences>
      </div>
    </div>
  `,
})
export class PreferencesDefaultComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }
}
