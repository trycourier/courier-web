import { forwardRef } from "react";
import { CourierInboxPopupMenu as CourierInboxPopupMenuElement } from "@trycourier/courier-ui-inbox";
import { CourierInboxPopupMenuComponent, CourierInboxPopupMenuProps, CourierRenderContext } from "@trycourier/courier-react-components";
import { reactNodeToHTMLElement } from "../utils/render";

/**
 * CourierInboxPopupMenu React component.
 *
 * This component is used to display a popup menu for a message in the inbox.
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
 * return <CourierInboxPopupMenu />;
 * ```
 */
export const CourierInboxPopupMenu = forwardRef<CourierInboxPopupMenuElement, CourierInboxPopupMenuProps>((props, ref) => {
  return (
    <CourierRenderContext.Provider value={reactNodeToHTMLElement}>
      <CourierInboxPopupMenuComponent {...props} ref={ref} />
    </CourierRenderContext.Provider>
  );
});

CourierInboxPopupMenu.displayName = 'CourierInboxPopupMenu';
