import { Courier } from "./courier";

export class AuthenticationListener {
  readonly callback: (props: { userId?: string }) => void;

  constructor(callback: (props: { userId?: string }) => void) {
    this.callback = callback;
  }

  public remove(): void {
    Courier.shared.removeAuthenticationListener(this);
  }

}