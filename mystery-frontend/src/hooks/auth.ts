import { isAxiosError } from "axios";
import { getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

import { isLoggedInAtom, usernameAtom } from "@/atoms/auth";
import { useMutation } from "@/hooks/mutations";
import { formatError } from "@/lib/errors";
import { login, logout } from "@/services/auth";
import { useToast } from "./toast";

export function useLoginMutation(beforeOnSuccess?: () => void | Promise<void>) {
  const { toast } = useToast();
  const setUsername = useSetAtom(usernameAtom, { store: getDefaultStore() });
  return useMutation({
    mutationFn: login,
    onSuccess: async ({ data }) => {
      await beforeOnSuccess?.();
      setUsername(data.username);
    },
    onError: (error) => {
      if (!isAxiosError(error) || error.status !== 301) {
        return;
      }

      const username = error.response?.data.username as string;

      if (!username) {
        return;
      }

      toast({
        title: formatError(error),
        description: `Welcome back, ${username}!`,
        duration: 5000,
      });
      setUsername(username);
    },
  });
}

export function useLogoutMutation() {
  const setUsername = useSetAtom(usernameAtom, { store: getDefaultStore() });
  return useMutation({
    mutationFn: logout,
    onSuccess: useCallback(() => setUsername(null), [setUsername]),
  });
}

export function useIsLoggedIn() {
  return useAtomValue(isLoggedInAtom, { store: getDefaultStore() });
}

export function useUsername() {
  return useAtomValue(usernameAtom, { store: getDefaultStore() })!;
}
