import { useState } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateTypingStatus } from "@/hooks/chat";
import { useSendMessage } from "@/hooks/messages";

const isMobile = window.innerWidth <= 768;

function ChatTextArea() {
  const [message, setMessage] = useState<string>("");
  useUpdateTypingStatus(message);
  const sendMessage = useSendMessage();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      // todo: block real names in BE? or is it too much
      sendMessage(trimmedMessage);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col w-full gap-1.5 p-4 bg-popover">
      <div className="relative">
        <Textarea
          placeholder="Type your message here."
          className="bg-input resize-none pr-10 sm:pr-[42px] min-h-[42px]"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoSize
          minRows={1}
          maxRows={6}
        />
        <Button
          size="miniIcon"
          className="absolute bottom-2 right-2 sm:bottom-[7px] sm:right-[7px]"
          disabled={!message.trim()}
          onClick={handleSendMessage}
        >
          <PaperPlaneIcon />
        </Button>
      </div>
      <WarningMessage />
    </div>
  );
}

function WarningMessage() {
  return (
    <p className="mx-0 sm:mx-2 text-xs sm:text-sm text-muted-foreground">
      Remember that you are <strong>forbidden</strong> from revealing your
      identity or making any hints towards who you are.
    </p>
  );
}

export default ChatTextArea;
