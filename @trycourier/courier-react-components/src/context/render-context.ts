import { createContext, ReactNode } from "react";

type RenderFn = (node: ReactNode) => HTMLElement;

export const CourierRenderContext = createContext<RenderFn | null>(null);
