import { Component, OnInit } from '@angular/core';
import { CourierInboxComponent, CourierService } from '@trycourier/courier-angular';

@Component({
  selector: 'app-custom-height',
  standalone: true,
  imports: [CourierInboxComponent],
  template: `
    <courier-inbox height="50vh"></courier-inbox>
  `,
})
export class CustomHeightComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }
}
