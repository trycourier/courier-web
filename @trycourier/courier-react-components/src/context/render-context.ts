import { createContext, ReactNode } from "react";

type RenderFn = (node: ReactNode) => HTMLElement;

/**
 * Context providing a function to render a React component.
 *
 * Courier's React package renders as follows:
 *
 *   - React engine (client application)
 *     - Courier React components
 *       - Courier web components
 *         - [Optional] User-provided React components (ex. a list item)
 *
 * By default, React will not render the user-provided React components within Courier's
 * web components. We instead manually render the user-provided React components and inject
 * them into the Courier web components.
 *
 * Client rendering changed between React 17 and 18, so the SDKs provide React version-specific
 * rendering functions. See
 * https://18.react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis.
 */
export const CourierRenderContext = createContext<RenderFn | null>(null);
