import { forwardRef, useRef, JSX, RefObject, useCallback } from "react";
import { ExampleBase as ExampleBaseElement, ExampleBaseListItem } from "@trycourier/courier-ui-inbox";
import { CourierClientComponent } from "./courier-client-component";
import { reactNodeToHTMLElement } from "../utils/utils";

export interface ExampleReactProps {
  renderItem?: (p: ExampleBaseListItem) => JSX.Element;
}

export const ExampleReact = forwardRef<ExampleBaseElement, ExampleReactProps>((props, forwardedRef) => {
  const innerRef = useRef<ExampleBaseElement | null>(null);

  const setRef = useCallback((el: ExampleBaseElement | null) => {
    innerRef.current = el;

    // expose to parent
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) (forwardedRef as RefObject<ExampleBaseElement | null>).current = el;

    // run only when we *have* a host
    if (el && props.renderItem) {
      queueMicrotask(() => {
        el.setListItem(index =>
          reactNodeToHTMLElement(props.renderItem!({ index }))
        );
      });
    }

  }, [forwardedRef, props.renderItem]);

  return (
    <CourierClientComponent>
      {/* @ts-ignore: custom element */}
      <example-base ref={setRef} />
    </CourierClientComponent>
  );

});

ExampleReact.displayName = "ExampleReact";