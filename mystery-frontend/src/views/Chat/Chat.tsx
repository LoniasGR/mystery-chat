import { Provider } from "jotai";
import { Separator } from "@/components/ui/separator";

import ChatTextArea from "./components/ChatTextArea";
import ChatHeader from "./components/ChatHeader";
import MessagesContainer from "./components/MessagesContainer";
import { useChatSocketInit } from "@/hooks/chat";

function Chat() {
  useChatSocketInit();

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <Separator />
      <Provider>
        <MessagesContainer />
        <Separator />
        <ChatTextArea />
      </Provider>
    </div>
  );
}

export default Chat;
