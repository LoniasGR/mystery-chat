import { useMutation } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { isLoggedInAtom, usernameAtom } from "@/atoms/auth";
import { login, logout } from "@/services/auth";

export function useLoginMutation(beforeOnSuccess?: () => void | Promise<void>) {
  const setUsername = useSetAtom(usernameAtom);
  return useMutation({
    mutationFn: login,
    onSuccess: async ({ data }) => {
      await beforeOnSuccess?.();
      setUsername(data.username);
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
