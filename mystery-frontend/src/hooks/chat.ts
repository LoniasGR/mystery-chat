import { useEffect, useMemo, useRef } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import {
  stopUserTypingAtom,
  startUserTypingAtom,
  typingUsersAtom,
} from "@/atoms/chat";
import socket from "@/lib/socket";

import { useUsername } from "./auth";

export function useChatSocketInit() {
  const startUserTyping = useSetAtom(startUserTypingAtom);
  const stopUserTyping = useSetAtom(stopUserTypingAtom);

  useEffect(() => {
    socket.connect();

    socket.on("typing", startUserTyping);
    socket.on("stopTyping", stopUserTyping);

    return () => {
      socket.off("typing", startUserTyping);
      socket.off("stopTyping", stopUserTyping);
      socket.disconnect();
    };
  }, [startUserTyping, stopUserTyping]);
}

export function useTypingUsers(): string[] {
  const typingUsersSet = useAtomValue(typingUsersAtom);

  return useMemo(() => Array.from(typingUsersSet), [typingUsersSet]);
}

export function useUpdateTypingStatus(message: string) {
  const username = useUsername();
  const hasMounted = useRef(false);

  const isTyping = message.length > 0; // todo: enhance this indicator (debounce etc.)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (isTyping) {
      socket.emit("typing", username);
    } else {
      socket.emit("stopTyping", username);
    }
  }, [isTyping, username]);
}
