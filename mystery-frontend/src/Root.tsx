import { getDefaultStore, useSetAtom } from "jotai";
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { resetUsernameAtom } from "@/atoms/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import router from "@/routes";
import {
  clearAxiosMiddleware,
  clearSocketMiddleware,
  handleAxiosUnauthorized,
  handleSocketAuthErrors,
} from "@/services/middleware";

function Root() {
  return (
    <MiddlewareHandler>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </MiddlewareHandler>
  );
}

function MiddlewareHandler({ children }: { children: React.ReactNode }) {
  const resetUsername = useSetAtom(resetUsernameAtom, {
    store: getDefaultStore(),
  });

  useEffect(() => {
    const middlewareId = handleAxiosUnauthorized(resetUsername);
    const eventHandlerRef = handleSocketAuthErrors(resetUsername);

    return () => {
      clearSocketMiddleware(eventHandlerRef);
      clearAxiosMiddleware(middlewareId);
    };
  }, [resetUsername]);

  return children;
}

export default Root;
