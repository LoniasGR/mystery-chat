import { useMutation } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { isAxiosError } from "axios";

import { isLoggedInAtom, usernameAtom } from "@/atoms/auth";
import { login, logout } from "@/services/auth";
import { formatError } from "@/lib/errors";
import { useToast } from "./toast";

export function useLoginMutation(beforeOnSuccess?: () => void | Promise<void>) {
  const { toast } = useToast();
  const setUsername = useSetAtom(usernameAtom);
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
  const setUsername = useSetAtom(usernameAtom);
  return useMutation({
    mutationFn: logout,
    onSuccess: () => setUsername(null),
  });
}

export function useIsLoggedIn() {
  return useAtomValue(isLoggedInAtom);
}

export function useUsername() {
  return useAtomValue(usernameAtom)!;
}
