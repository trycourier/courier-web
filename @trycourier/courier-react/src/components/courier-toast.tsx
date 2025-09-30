import { forwardRef } from "react";
import { CourierToast as CourierToastElement } from "@trycourier/courier-ui-inbox";
import { CourierToastComponent, CourierToastProps, CourierRenderContext } from "@trycourier/courier-react-components";
import { reactNodeToHTMLElement } from "../utils/render";

/**
 * CourierToast React component.
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
 * return <CourierToast />;
 * ```
 */
export const CourierToast = forwardRef<CourierToastElement, CourierToastProps>((props, ref) => {
  return (
    <CourierRenderContext.Provider value={reactNodeToHTMLElement}>
      <CourierToastComponent {...props} ref={ref} />
    </CourierRenderContext.Provider>
  );
});

CourierToast.displayName = 'CourierToast';
