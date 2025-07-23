import { forwardRef } from "react";
import { CourierInboxPopupMenu as CourierInboxPopupMenuElement } from "@trycourier/courier-ui-inbox";
import { CourierInboxPopupMenuComponent, CourierInboxPopupMenuProps, CourierRenderContext } from "@trycourier/courier-react-components";
import { reactNodeToHTMLElement } from "../utils/render";

/**
 * CourierInboxPopupMenu is a wrapper that provides a React 18+ specific render function.
 */
export const CourierInboxPopupMenu = forwardRef<CourierInboxPopupMenuElement, CourierInboxPopupMenuProps>((props, ref) => {
  return (
    <CourierRenderContext.Provider value={reactNodeToHTMLElement}>
      <CourierInboxPopupMenuComponent {...props} ref={ref} />
    </CourierRenderContext.Provider>
  );
});

CourierInboxPopupMenu.displayName = 'CourierInboxPopupMenu';
