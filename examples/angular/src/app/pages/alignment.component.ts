import { Component, OnInit } from '@angular/core';
import { CourierInboxPopupMenuComponent, CourierService } from '@trycourier/courier-angular';

@Component({
  selector: 'app-alignment',
  standalone: true,
  imports: [CourierInboxPopupMenuComponent],
  template: `
    <div style="display: flex; justify-content: center; align-items: center; padding: 100px;">
      <courier-inbox-popup-menu
        popupAlignment="top-right"
        popupWidth="340px"
        popupHeight="400px"
        top="44px"
        right="44px"
      ></courier-inbox-popup-menu>
    </div>
  `,
})
export class AlignmentComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }
}
