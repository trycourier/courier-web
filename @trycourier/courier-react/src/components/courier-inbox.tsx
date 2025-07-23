import { forwardRef } from "react";
import { CourierInbox as CourierInboxElement } from "@trycourier/courier-ui-inbox";
import { CourierInboxComponent, CourierInboxProps, CourierRenderContext } from "@trycourier/courier-react-components";
import { reactNodeToHTMLElement } from "../utils/render";

/**
 * CourierInbox is a wrapper that provides a React 18+ specific render function.
 */
export const CourierInbox = forwardRef<CourierInboxElement, CourierInboxProps>((props, ref) => {
  return (
    <CourierRenderContext.Provider value={reactNodeToHTMLElement}>
      <CourierInboxComponent {...props} ref={ref} />
    </CourierRenderContext.Provider>
  );
});

CourierInbox.displayName = 'CourierInbox';
