import React, { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const UnreadMessagesIndicator: React.FC<{
  count: number;
  chatContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}> = ({ count, chatContainerRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleClick = useCallback(() => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatContainerRef]);

  useEffect(() => {
    if (count) {
      setIsVisible(true);
      return;
    }

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 90);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [count]);

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      className={cn(
        "absolute bottom-2 font-bold h-auto gap-1 py-1 pl-1 pr-2 text-xs self-center",
        count > 0
          ? "animate-in slide-in-from-bottom-5 zoom-in"
          : "animate-out slide-out-to-bottom-5 zoom-out"
      )}
      onClick={handleClick}
    >
      <ArrowDownIcon className="h-2 w-2" /> {count || ""}
    </Button>
  );
};

export default UnreadMessagesIndicator;
