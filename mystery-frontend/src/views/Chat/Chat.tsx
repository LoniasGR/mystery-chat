import { Separator } from "@/components/ui/separator";

import ChatTextArea from "./components/ChatTextArea";
import ChatHeader from "./components/ChatHeader";
import MessagesContainer from "./components/MessagesContainer";

function Chat() {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <Separator />
      <MessagesContainer />
      <Separator />
      <ChatTextArea />
    </div>
  );
}

export default Chat;
