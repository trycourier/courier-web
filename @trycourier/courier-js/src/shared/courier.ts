import { CourierClient, CourierProps } from "../client/courier-client";
import { AuthenticationListener } from '../shared/authentication-listener';

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
  private instanceClient?: CourierClient;

  /**
   * The pagination limit (min: 1, max: 100)
   */
  private _paginationLimit = 24;

  public get paginationLimit(): number {
    return this._paginationLimit;
  }

  public set paginationLimit(value: number) {
    this._paginationLimit = Math.min(Math.max(value, 1), 100);
  }

  /**
   * Get the Courier client instance
   * @returns The Courier client instance or undefined if not signed in
   */
  public get client(): CourierClient | undefined {
    return this.instanceClient;
  }

  /**
   * The authentication listeners
   */
  private authenticationListeners: AuthenticationListener[] = [];

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
    this.instanceClient = new CourierClient(props);
    this.notifyAuthenticationListeners({ userId: props.userId });
  }

  /**
   * Sign out of Courier
   */
  public signOut() {
    this.instanceClient = undefined;
    this.notifyAuthenticationListeners({ userId: undefined });
  }

  /**
   * Register a callback to be notified of authentication state changes
   * @param callback - Function to be called when authentication state changes
   * @returns AuthenticationListener instance that can be used to remove the listener
   */
  public addAuthenticationListener(callback: (props: { userId?: string }) => void): AuthenticationListener {
    this.instanceClient?.options.logger.info('Adding authentication listener');
    const listener = new AuthenticationListener(callback);
    this.authenticationListeners.push(listener);
    return listener;
  }

  /**
   * Unregister an authentication state change listener
   * @param listener - The AuthenticationListener instance to remove
   */
  public removeAuthenticationListener(listener: AuthenticationListener) {
    this.instanceClient?.options.logger.info('Removing authentication listener');
    this.authenticationListeners = this.authenticationListeners.filter(l => l !== listener);
  }

  /**
   * Notify all authentication listeners
   * @param props - The props to notify the listeners with
   */
  private notifyAuthenticationListeners(props: { userId?: string }) {
    this.authenticationListeners.forEach(listener => listener.callback(props));
  }

}
