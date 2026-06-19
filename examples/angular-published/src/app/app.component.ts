import { Component, OnInit } from '@angular/core';
import { CourierInboxComponent, CourierService } from '@trycourier/courier-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CourierInboxComponent],
  // Render Courier's default inbox, mirroring the default inbox in the
  // `angular` showcase.
  template: `<courier-inbox></courier-inbox>`,
})
export class AppComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    // Sign the user in so the inbox can load their messages. Without valid
    // credentials the inbox renders its empty / signed-out state.
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }
}
