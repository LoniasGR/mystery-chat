import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { getDefaultStore, useSetAtom } from "jotai";
import { resetUsernameAtom } from "@/atoms/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import router from "@/routes";
import {
  handleAxiosUnauthorized,
  handleSocketAuthErrors,
  clearAxiosMiddleware,
  clearSocketMiddleware,
} from "@/services/middleware";

const queryClient = new QueryClient();

function Root() {
  return (
    <MiddlewareHandler>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
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
