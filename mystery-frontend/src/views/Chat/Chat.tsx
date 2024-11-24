import type { ReactNode } from "react";
import { Provider } from "jotai";
import { useChatSocketInit } from "@/hooks/chat";
import { Separator } from "@/components/ui/separator";
import ChatTextArea from "./components/ChatTextArea";
import ChatHeader from "./components/ChatHeader";
import MessagesContainer from "./components/MessagesContainer";

function Chat() {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <Separator />
      <Provider>
        <ChatProvider>
          <MessagesContainer />
          <Separator />
          <ChatTextArea />
        </ChatProvider>
      </Provider>
    </div>
  );
}

function ChatProvider({ children }: { children: ReactNode }) {
  useChatSocketInit();

  return children;
}

export default Chat;
