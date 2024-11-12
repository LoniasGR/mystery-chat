import { useState } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateTypingStatus } from "@/hooks/chat";
import { useSendMessage } from "@/hooks/messages";

function ChatTextArea() {
  const [message, setMessage] = useState<string>("");
  useUpdateTypingStatus(message);
  const sendMessage = useSendMessage();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // todo: block real names in BE? or is it too much
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col w-full gap-1.5 p-4 bg-popover">
      <div className="relative">
        {/* TODO: instead of resizable textarea, make an auto resize (on enter) */}
        <Textarea
          placeholder="Type your message here."
          className="max-h-[150px] bg-input"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          size="icon"
          className="absolute bottom-3 right-2"
          disabled={!message.trim()}
          onClick={handleSendMessage}
        >
          <PaperPlaneIcon className="h-4 w-4" />
        </Button>
      </div>
      <WarningMessage />
    </div>
  );
}

function WarningMessage() {
  return (
    <p className="mx-2 text-sm text-muted-foreground">
      Remember that you are <strong>forbidden</strong> from revealing your
      identity or making any hints towards who you are.
    </p>
  );
}

export default ChatTextArea;
