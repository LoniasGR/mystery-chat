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
  const username = useUsername();
  const startUserTyping = useSetAtom(startUserTypingAtom);
  const stopUserTyping = useSetAtom(stopUserTypingAtom);

  useEffect(() => {
    function _startUserTyping(incomingUsername: string) {
      if (incomingUsername !== username) {
        return startUserTyping(incomingUsername);
      }
    }

    function _stopUserTyping(incomingUsername: string) {
      if (incomingUsername !== username) {
        return stopUserTyping(incomingUsername);
      }
    }

    socket.connect();
    socket.emit("user:init", username);

    socket.on("typing:start", _startUserTyping);
    socket.on("typing:stop", _stopUserTyping);
    socket.on("user:disconnect", _stopUserTyping);

    return () => {
      socket.off("typing:start", _startUserTyping);
      socket.off("typing:stop", _stopUserTyping);
      socket.off("user:disconnect", _stopUserTyping);
      socket.disconnect();
    };
  }, [startUserTyping, stopUserTyping, username]);
}

export function useTypingUsers(): string[] {
  const typingUsersSet = useAtomValue(typingUsersAtom);

  return useMemo(() => Array.from(typingUsersSet), [typingUsersSet]);
}

export function useUpdateTypingStatus(message: string) {
  const username = useUsername();
  const hasMounted = useRef(false);

  // FUTURE: enhance this indicator (debounce, timeouts after someone stops typing etc.)
  const isTyping = message.length > 0;

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (isTyping) {
      socket.emit("typing:start", username);
    } else {
      socket.emit("typing:stop", username);
    }
  }, [isTyping, username]);
}
