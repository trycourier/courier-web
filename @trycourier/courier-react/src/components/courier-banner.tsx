import { forwardRef } from "react";
import { CourierBanner as CourierBannerElement } from "@trycourier/courier-ui-banner";
import { CourierBannerComponent, CourierBannerProps, CourierRenderContext } from "@trycourier/courier-react-components";
import { reactNodeToHTMLElement } from "../utils/render";

/**
 * CourierBanner React component.
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
 * return <CourierBanner />;
 * ```
 */
export const CourierBanner = forwardRef<CourierBannerElement, CourierBannerProps>((props, ref) => {
  return (
    <CourierRenderContext.Provider value={reactNodeToHTMLElement}>
      <CourierBannerComponent {...props} ref={ref} />
    </CourierRenderContext.Provider>
  );
});

CourierBanner.displayName = 'CourierBanner';
