import { useMemo, useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { typingUsersAtom } from "@/atoms/chat";

export default function TypingIndicators() {
  const typingUsers = useTypingUsers();

  if (!typingUsers) {
    return null;
  }

  // todo: styling
  return (
    <div className="text-xs text-gray-500">
      {typingUsers}
      <Dots />
    </div>
  );
}

function useTypingUsers() {
  const typingUsersSet = useAtomValue(typingUsersAtom);

  return useMemo(() => {
    const setSize = typingUsersSet.size;

    if (setSize === 0) {
      return null;
    }

    return `${Array.from(typingUsersSet).join(", ")} ${
      setSize > 1 ? "are" : "is"
    } typing`;
  }, [typingUsersSet]);
}

function Dots() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return dots;
}
