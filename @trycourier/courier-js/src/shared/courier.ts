import { CourierClient, CourierProps } from "../client/courier-client";
import { AuthenticationListener } from "./authentication-listener";

/**
 * Courier is a singleton class that manages a shared Courier client instance and other resources.
 * UI components will automatically syncronize with this instance.
 * If you only need to call the Courier api, you should consider using the CourierClient directly.
 */
export class Courier {

  /**
   * The shared Courier instance
   */
  private static instance: Courier;

  /**
   * The Courier client instance
   */
  private client?: CourierClient;

  /**
   * The authentication listeners
   */
  private authenticationListeners: ((props: { userId?: string }) => void)[] = [];

  /**
   * Get the shared Courier instance
   * @returns The shared Courier instance
   */
  public static get shared(): Courier {
    if (!Courier.instance) {
      Courier.instance = new Courier();
    }
    return Courier.instance;
  }

  /**
   * Sign in to Courier
   * @param options - The options for the Courier client
   */
  public signIn(props: CourierProps) {
    this.client = new CourierClient(props);
    this.notifyAuthenticationListeners({ userId: props.userId });
  }

  /**
   * Sign out of Courier
   */
  public signOut() {
    this.client = undefined;
    this.notifyAuthenticationListeners({ userId: undefined });
  }

  /**
   * Get the Courier client instance
   * @returns The Courier client instance or undefined if not signed in
   */
  public getClient(): CourierClient | undefined {
    return this.client;
  }

  /**
   * Add an authentication listener
   * @param listener - The listener to add
   */
  public addAuthenticationListener(callback: (props: { userId?: string }) => void) {
    this.authenticationListeners.push(callback);
  }

  /**
   * Remove an authentication listener
   * @param listener - The listener to remove
   */
  public removeAuthenticationListener(listener: AuthenticationListener) {
    this.authenticationListeners = this.authenticationListeners.filter(l => l !== listener);
  }

  /**
   * Remove all authentication listeners
   */
  public removeAllAuthenticationListeners() {
    this.authenticationListeners = [];
  }

  /**
   * Notify all authentication listeners
   * @param props - The props to notify the listeners with
   */
  private notifyAuthenticationListeners(props: { userId?: string }) {
    this.authenticationListeners.forEach(listener => listener(props));
  }

}
