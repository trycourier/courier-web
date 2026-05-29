import { forwardRef } from "react";
import { CourierPreferences as CourierPreferencesElement } from "@trycourier/courier-ui-preferences";
import { CourierPreferencesComponent, CourierPreferencesProps, CourierRenderContext } from "@trycourier/courier-react-components";
import { reactNodeToHTMLElement } from "../utils/render";

/**
 * CourierPreferences React component.
 *
 * @example
 * ```tsx
 * const courier = useCourier();
 *
 * useEffect(() => {
 *   courier.shared.signIn({
 *     userId: $YOUR_USER_ID,
 *     jwt: jwt,
 *   });
 * }, []);
 *
 * return <CourierPreferences />;
 * ```
 */
export const CourierPreferences = forwardRef<CourierPreferencesElement, CourierPreferencesProps>((props, ref) => {
  return (
    <CourierRenderContext.Provider value={reactNodeToHTMLElement}>
      <CourierPreferencesComponent {...props} ref={ref} />
    </CourierRenderContext.Provider>
  );
});

CourierPreferences.displayName = 'CourierPreferences';
