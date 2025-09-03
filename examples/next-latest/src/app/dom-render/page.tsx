'use client'

import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { CourierInbox, useCourier } from "@trycourier/courier-react";

function CourierApp() {
  const courier = useCourier();

  // Get the user's JWT from courier
  async function getJwt(): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return process.env.NEXT_PUBLIC_JWT!;
  }

  // Handles sign in
  async function signCourierUserIn() {
    const jwt = await getJwt();
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt,
    });
  }

  useEffect(() => {
    signCourierUserIn();
  }, []);

  return (
    <>
      <h1>{courier.inbox.unreadCount ?? 0}</h1>
      <CourierInbox />
    </>
  );
}

// Creates your Courier App
function initializeCourierApp() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    // Not running in a browser environment
    return;
  }

  // Prevent duplicate containers
  if (document.getElementById("courier-inbox-container")) {
    return;
  }

  const courierContainer = document.createElement("div");
  courierContainer.id = "courier-inbox-container";
  courierContainer.style.position = "relative";
  courierContainer.style.zIndex = "10000";
  document.body.insertBefore(courierContainer, document.body.firstChild);

  const root = createRoot(courierContainer);
  root.render(
    <StrictMode>
      <CourierApp />
    </StrictMode>
  );
}

// This is slightly different than your code, but should get a similar result
export default function Page() {
  useEffect(() => {
    initializeCourierApp();
  }, []);

  return null;
}