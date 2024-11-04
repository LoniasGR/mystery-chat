import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon, ExitIcon } from "@radix-ui/react-icons";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Logo from "@/assets/app-logo.webp";

function ChatHeader() {
  return (
    <div className="flex p-2 gap-3 md:p-4 items-center bg-popover">
      <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
        <AvatarImage src={Logo} />
      </Avatar>
      <h1 className="scroll-m-20 text-base sm:text-lg lg:text-2xl font-extrabold tracking-tight">
        Gatsby's Room of Mysterious Whispers
      </h1>
      <div className="ml-auto flex gap-1">
        <TooltipProvider>
          <DarkModeToggle />
          <LogoutButton />
        </TooltipProvider>
      </div>
    </div>
  );
}

function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  const Icon = theme !== "dark" ? MoonIcon : SunIcon;
  const handleThemeChange = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle color mode"
          onClick={handleThemeChange}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle color mode</p>
      </TooltipContent>
    </Tooltip>
  );
}

function LogoutButton() {
  const [loading, setLoading] = useState(false); // todo: this is a mock
  const navigate = useNavigate();

  const handleLogout = async () => {
    // todo: this is a mock
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    navigate("/login");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Logout"
          onClick={handleLogout}
          isLoading={loading}
        >
          <ExitIcon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Logout</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default ChatHeader;
