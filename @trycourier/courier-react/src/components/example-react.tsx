import { useEffect, useRef, forwardRef, JSX } from "react";
import { ExampleBase as ExampleBaseElement, ExampleBaseListItem } from "@trycourier/courier-ui-inbox";
import { CourierClientComponent } from "./courier-client-component";

export interface ExampleReactProps {
  renderContent?: (p: ExampleBaseListItem | undefined | null) => JSX.Element;
}

/* ---------- React wrapper ---------- */
export const ExampleReact = forwardRef<ExampleBaseElement, ExampleReactProps>((_props, ref) => {

  const elementRef = useRef<ExampleBaseElement>(null);
  // const reactRoot = useRef<Root | null>(null);

  /* expose inner ref to parent */
  useEffect(() => {
    if (typeof ref === "function") {
      ref(elementRef.current);
    } else if (ref) {
      (ref as React.RefObject<ExampleBaseElement | null>).current = elementRef.current;
    }
  }, [ref]);

  // /* (re-)render whenever the caller changes renderContent */
  // useEffect(() => {
  //   const host = elementRef.current;
  //   if (!host || !props.renderContent) return;

  //   /* create a fresh mount point inside the component */
  //   const container = document.createElement("div");
  //   host.setListItem(container);

  //   /* mount / remount JSX into that container */
  //   reactRoot.current?.unmount();
  //   reactRoot.current = createRoot(container);
  //   reactRoot.current.render(props.renderContent(null));

  //   return () => reactRoot.current?.unmount(); // cleanup on unmount
  // }, [props.renderContent]);

  return (
    <CourierClientComponent>
      {/* @ts-ignore */}
      <example-base ref={elementRef} />
    </CourierClientComponent>
  );
}
);

ExampleReact.displayName = "ExampleReact";