import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { CourierInboxProps } from "./index";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "courier-inbox": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & CourierInboxProps;
    }
  }
}