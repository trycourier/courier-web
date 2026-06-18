import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  CourierInboxComponent,
  CourierService,
  type CourierInboxElement,
} from '@trycourier/courier-angular';

@Component({
  selector: 'app-element-ref',
  standalone: true,
  imports: [CourierInboxComponent],
  template: `
    <courier-inbox #inbox></courier-inbox>
  `,
})
export class ElementRefComponent implements OnInit, AfterViewInit {
  constructor(private courier: CourierService) {}

  // The host element of the CourierInboxComponent IS the underlying
  // `<courier-inbox>` custom element, so we can read it via an ElementRef.
  @ViewChild('inbox', { read: ElementRef }) inboxRef?: ElementRef<CourierInboxElement>;

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.inboxRef?.nativeElement.removeHeader();
    });
  }
}
