import { useCallback, useEffect, useRef, useState } from "react";
import { useSetAtom, useAtom } from "jotai";
import { v4 as uuid } from "uuid";
import { messagesAtom, storeNewMessageAtom } from "@/atoms/chat";
import socket from "@/lib/socket";
import { useUsername } from "./auth";
import type { Message } from "@/types";

export function useSendMessage() {
  const username = useUsername();
  const storeMessage = useSetAtom(storeNewMessageAtom);

  return useCallback(
    (message: string) => {
      const newMessage = storeMessage(message, username);
      socket.emit("messages:send", newMessage);
    },
    [username, storeMessage]
  );
}

// FUTURE: In case of an implementation of multiple chats, this hook should be refactored into atoms, and each chat should come with its own jotai Provider
// TODO: this probably could be refactored a tiny bit to allow using this hook from many places without messing up the Messages state but is good enough for now
export function useMessages({ manualFetch = false } = {}) {
  const clientChatId = useRef<string | null>(null); // keeping integrity of the messages due to StrictMode re-rendering and emitting messages twice
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryFullyLoaded, setIsHistoryFullyLoaded] = useState(false);

  const oldestMessageTimestamp = messages.at(0)?.timestamp; // todo: id or timestamp?

  useEffect(() => {
    function handleMessagesHistory(messages: Message[], chatId?: string) {
      if (clientChatId.current !== chatId) {
        return;
      }

      if (messages.length > 0) {
        setMessages((prev) => [...messages, ...prev]);
      } else {
        setIsHistoryFullyLoaded(true);
      }
      setIsLoading(false);
    }

    function handleMessageReceival(message: Message) {
      setMessages((prev) => [...prev, message]);
    }

    socket.on("messages:history", handleMessagesHistory);
    socket.on("messages:receive", handleMessageReceival);

    return () => {
      socket.off("messages:history", handleMessagesHistory);
      socket.off("messages:receive", handleMessageReceival);
    };
  }, [setIsLoading, setMessages, setIsHistoryFullyLoaded]);

  const fetchMessages = useCallback(() => {
    if (isHistoryFullyLoaded) {
      return;
    }

    if (!clientChatId.current) {
      clientChatId.current = uuid();
    }

    setIsLoading(true);
    socket.emit("messages:fetch", oldestMessageTimestamp, clientChatId.current);
  }, [
    oldestMessageTimestamp,
    setIsLoading,
    isHistoryFullyLoaded,
    clientChatId,
  ]);

  useEffect(() => {
    if (!manualFetch) {
      setIsLoading(true);
      clientChatId.current = uuid();
      socket.emit("messages:fetch", undefined, clientChatId.current);
    }
  }, [manualFetch, setIsLoading]);

  return {
    fetchMessages,
    isFetching: isLoading,
    messages,
    isMoreToFetch: !isHistoryFullyLoaded,
  };
}
