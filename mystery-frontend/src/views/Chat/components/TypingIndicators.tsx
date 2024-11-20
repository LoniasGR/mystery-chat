import React, { useMemo, useState, useEffect, useLayoutEffect } from "react";
import { useAtomValue } from "jotai";
import { typingUsersAtom } from "@/atoms/chat";

const TypingIndicators: React.FC<{ onChange?: () => void }> = ({
  onChange,
}) => {
  const typingUsersSet = useAtomValue(typingUsersAtom);

  const typingUsers = useMemo(() => {
    const setSize = typingUsersSet.size;

    if (setSize === 0) {
      return null;
    }

    return `${Array.from(typingUsersSet).join(", ")} ${
      setSize > 1 ? "are" : "is"
    } typing`;
  }, [typingUsersSet]);

  const areUsersTyping = typingUsersSet.size > 0;

  useLayoutEffect(() => {
    onChange?.();
  }, [areUsersTyping, onChange]);

  if (!typingUsers) {
    return null;
  }

  return (
    <div className="text-xs text-gray-500">
      {typingUsers}
      <Dots />
    </div>
  );
};

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

export default TypingIndicators;
