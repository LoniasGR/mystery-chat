import { useCallback } from "react";
import { useMessages } from "@/hooks/messages";
import Message from "./Message";
import TypingIndicators from "./TypingIndicators";

function MessagesContainer() {
  const { data, isLoading } = useMessages(); // todo: add params, and error handling
  const chatContainerRef = useAutoScrollDown();

  if (isLoading) {
    return <MessagesContainerSkeleton />;
  }

  return (
    <div
      className="flex-1 p-4 flex flex-col gap-4 overflow-auto"
      ref={chatContainerRef}
    >
      {data?.map((message) => (
        <Message key={message.meta.id} {...message} />
      ))}
      <TypingIndicators />
    </div>
  );
}

function MessagesContainerSkeleton() {
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden justify-end">
      {[...Array(14)].map((_, i) => (
        <Message.Skeleton key={i} isYou={i % 3 === 0} />
      ))}
    </div>
  );
}

function useAutoScrollDown() {
  return useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, []);
}

export default MessagesContainer;
