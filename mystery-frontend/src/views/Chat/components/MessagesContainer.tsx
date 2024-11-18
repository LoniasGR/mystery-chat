import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { useMessages } from "@/hooks/messages";
import { useIntersectionObserver } from "@/hooks/misc";
import Loader from "@/components/ui/loader";
import { useUsername } from "@/hooks/auth";
import Message from "./Message";
import TypingIndicators from "./TypingIndicators";
import UnreadMessagesIndicator from "./UnreadMessagesIndicator";

import type { Message as MessageType } from "@/common/types";

function MessagesContainer() {
  const { messages, isFetching, isMoreToFetch, fetchMessages } = useMessages(); // todo: add some error handling
  const {
    ref: chatContainerRef,
    callbackRef: chatContainerCallbackRef,
    newUnreadMessages,
    scrollToBottomIfFullyScrolled,
    onContainerScroll,
  } = useScrollOnNewMessage(messages);

  if (!messages.length && isFetching) {
    return <MessagesContainerSkeleton />;
  }

  return (
    <div className="flex-1 overflow-hidden relative flex flex-col">
      <div
        className="p-4 flex flex-col gap-4 overflow-auto h-full"
        ref={chatContainerCallbackRef}
        onScroll={onContainerScroll}
      >
        <MessageFetcher
          isFetching={isFetching}
          isMoreToFetch={isMoreToFetch}
          fetchMessages={fetchMessages}
        />
        {messages?.map((message) => (
          <Message key={message._id} {...message} />
        ))}
        <TypingIndicators onChange={scrollToBottomIfFullyScrolled} />
      </div>
      <UnreadMessagesIndicator
        count={newUnreadMessages}
        chatContainerRef={chatContainerRef}
      />
    </div>
  );
}

const MessageFetcher: React.FC<
  Omit<ReturnType<typeof useMessages>, "messages">
> = ({ isFetching, isMoreToFetch, fetchMessages }) => {
  const ref = useIntersectionObserver<HTMLDivElement>(
    useCallback(() => {
      if (!isFetching) {
        fetchMessages();
      }
    }, [isFetching, fetchMessages])
  );

  if (!isMoreToFetch) {
    return (
      <div className="text-xs text-gray-500 self-center min-h-6">
        You've heard all the whispers
      </div>
    );
  }

  return <Loader ref={ref} isAnimating={isFetching} className="min-h-6" />;
};

function MessagesContainerSkeleton() {
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden justify-end">
      {[...Array(14)].map((_, i) => (
        <Message.Skeleton key={i} isYou={i % 3 === 0} />
      ))}
    </div>
  );
}

function useScrollOnNewMessage(messages: MessageType[]) {
  const username = useUsername();
  const [newUnreadMessages, setNewUnreadMessages] = useState(0);

  const ref = useRef<HTMLDivElement | null>(null);
  const containerScrollHeight = useRef<number>(0);
  const debouncedOnScrollHandler = useRef<ReturnType<typeof debounce> | null>(
    null
  );

  const previousFirstMessageId = useRef<string | null>(null);
  const previousLastMessageId = useRef<string | null>(null);
  const firstMessage = messages.at(0);
  const lastMessage = messages.at(-1);

  const updateScrollHeightRef = useCallback(() => {
    if (ref.current) {
      containerScrollHeight.current = ref.current.scrollHeight;
    }
  }, []);

  const isFullyScrolled = useCallback(() => {
    if (!ref.current) {
      return false;
    }
    return (
      containerScrollHeight.current -
        ref.current.scrollTop -
        ref.current.clientHeight <
      10
    );
  }, []);

  const scrollToBottom = useCallback(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, []);

  const scrollToBottomIfFullyScrolled = useCallback(() => {
    if (!ref.current) {
      return;
    }

    if (isFullyScrolled()) {
      scrollToBottom();
    }
    updateScrollHeightRef();
  }, [isFullyScrolled, scrollToBottom, updateScrollHeightRef]);

  // check if is fully scrolled and if so, reset the unread messages count
  const onContainerScroll = useCallback(() => {
    if (debouncedOnScrollHandler.current) {
      debouncedOnScrollHandler.current.cancel();
    }

    debouncedOnScrollHandler.current = debounce(() => {
      if (isFullyScrolled()) {
        setNewUnreadMessages(0);
      }
    }, 200);

    debouncedOnScrollHandler.current();
  }, [isFullyScrolled, setNewUnreadMessages]);

  // When new messages are loaded on top, maintain the perceived scroll position
  useLayoutEffect(() => {
    if (!firstMessage || !ref.current) {
      return;
    }

    if (previousFirstMessageId.current) {
      const scrollHeightDiff =
        ref.current.scrollHeight - containerScrollHeight.current;

      if (ref.current.scrollTop < scrollHeightDiff) {
        ref.current.scrollTop += scrollHeightDiff;
      }
    }

    previousFirstMessageId.current = firstMessage._id;
    updateScrollHeightRef();
  }, [firstMessage, updateScrollHeightRef]);

  // When a new message is loaded at the bottom:
  // - ALWAYS scroll to the bottom if the current user is the sender of that last message
  // - Scroll to the bottom if the user has already been at the bottom
  // - Otherwise, increment the unread messages count
  useLayoutEffect(() => {
    if (!lastMessage || !ref.current) {
      return;
    }

    if (previousLastMessageId.current) {
      const _isFullyScrolled = isFullyScrolled();
      const isSentByCurrentUser = lastMessage.user._id === username;

      if (isSentByCurrentUser || _isFullyScrolled) {
        scrollToBottom();
      }

      if (!_isFullyScrolled && !isSentByCurrentUser) {
        setNewUnreadMessages((prev) => prev + 1);
      }
    }

    previousLastMessageId.current = lastMessage._id;
    updateScrollHeightRef();
  }, [
    lastMessage,
    updateScrollHeightRef,
    username,
    isFullyScrolled,
    scrollToBottom,
  ]);

  return {
    ref,
    callbackRef: useCallback((node: HTMLDivElement | null) => {
      if (node) {
        ref.current = node;
        node.scrollTop = node.scrollHeight;
      }
    }, []),
    newUnreadMessages,
    scrollToBottomIfFullyScrolled,
    onContainerScroll,
  } as const;
}

export default MessagesContainer;
