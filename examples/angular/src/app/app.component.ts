import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Courier } from '@trycourier/courier-ui-inbox';

type CourierInboxElement = HTMLElement & {
  onMessageClick: (cb: (props: { message: unknown; index: number }) => void) => void;
};

@Component({
  selector: 'app-root',
  standalone: true,
  // Allow Angular to render the native <courier-inbox> custom element as-is
  // instead of trying to resolve it as an Angular component.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<courier-inbox #inbox></courier-inbox>`,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('inbox') inboxRef!: ElementRef<CourierInboxElement>;

  ngAfterViewInit(): void {
    Courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });

    this.inboxRef.nativeElement.onMessageClick(({ message, index }) => {
      alert('Message clicked at index ' + index + ':\n' + JSON.stringify(message, null, 2));
    });
  }
}
