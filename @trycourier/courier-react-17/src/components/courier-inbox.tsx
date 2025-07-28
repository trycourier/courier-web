import { forwardRef } from "react";
import { CourierInbox as CourierInboxElement } from "@trycourier/courier-ui-inbox";
import { CourierInboxComponent, CourierInboxProps, CourierRenderContext } from "@trycourier/courier-react-components";
import { reactNodeToHTMLElement } from "../utils/render";

/**
 * CourierInbox React component.
 *
 * @example
 * ```tsx
 * const courier = useCourier();
 *
 * useEffect(() => {
 *   // Generate a JWT for your user (do this on your backend server)
 *   const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual JWT
 *
 *   // Authenticate the user with the inbox
 *   courier.shared.signIn({
 *     userId: $YOUR_USER_ID,
 *     jwt: jwt,
 *   });
 * }, []);
 *
 * return <CourierInbox />;
 * ```
 */
export const CourierInbox = forwardRef<CourierInboxElement, CourierInboxProps>((props, ref) => {
  return (
    <CourierRenderContext.Provider value={reactNodeToHTMLElement}>
      <CourierInboxComponent {...props} ref={ref} />
    </CourierRenderContext.Provider>
  );
});

CourierInbox.displayName = 'CourierInbox';
