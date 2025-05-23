import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { CourierInboxProps, CourierInboxMenuProps } from "./index";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "courier-inbox": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & CourierInboxProps;
      "courier-inbox-menu": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & CourierInboxMenuProps;
    }
  }
}