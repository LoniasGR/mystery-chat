import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { typingUsersAtom } from "@/atoms/chat";

export default function TypingIndicators() {
  const typingUsers = useTypingUsers();

  if (typingUsers.length === 0) {
    return null;
  }

  // todo: styling
  return (
    <div className="flex items-center space-x-2">
      {typingUsers.map((username) => (
        <div key={username} className="text-xs text-gray-500">
          {username} is typing...
        </div>
      ))}
    </div>
  );
}

function useTypingUsers(): string[] {
  const typingUsersSet = useAtomValue(typingUsersAtom);

  return useMemo(() => Array.from(typingUsersSet), [typingUsersSet]);
}
