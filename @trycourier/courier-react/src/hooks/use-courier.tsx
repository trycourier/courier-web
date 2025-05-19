import React from "react";
import { Courier } from "@trycourier/courier-js";

export const useCourier = () => {

  React.useEffect(() => {
    // Ensure Courier is initialized
  }, []);

  return Courier.shared;
};
