import { Avatar, AvatarImage } from "@/components/ui/avatar";

import Logo from "@/assets/app-logo.webp";

function ChatHeader() {
  return (
    <div className="flex p-4 gap-3 items-center bg-card">
      <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
        <AvatarImage src={Logo} />
      </Avatar>
      <h1 className="scroll-m-20 text-base sm:text-lg lg:text-2xl font-extrabold tracking-tight">
        Gatsby's Room of Mysterious Whispers
      </h1>
    </div>
  );
}

export default ChatHeader;
