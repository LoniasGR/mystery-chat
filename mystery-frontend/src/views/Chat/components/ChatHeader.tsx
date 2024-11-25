import {
  SunIcon,
  MoonIcon,
  ExitIcon,
  SpeakerLoudIcon,
  SpeakerOffIcon,
  MobileIcon,
} from "@radix-ui/react-icons";
import { useAtom } from "jotai";

import { notificationVariantAtom } from "@/atoms/notifications";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { isMobile } from "@/lib/devices";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLogoutMutation } from "@/hooks/auth";

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
          <AudioToggle />
          <DarkModeToggle />
          <LogoutButton />
        </TooltipProvider>
      </div>
    </div>
  );
}

function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  const Icon = theme === "dark" ? MoonIcon : SunIcon;
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
  const { mutate: logout, isPending } = useLogoutMutation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Logout"
          onClick={logout}
          isLoading={isPending}
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

function AudioToggle() {
  const [variant, setVariant] = useAtom(notificationVariantAtom);

  if (isMobile) {
    return null;
  }

  const Icon = notificationVariantIcon[variant];
  const handleAudioToggle = () =>
    setVariant((prev) => {
      if (prev === "none") return "sound";
      return "none";
    });
  const label = notificationVariantLabel[variant];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          onClick={handleAudioToggle}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

const notificationVariantIcon = {
  none: SpeakerOffIcon,
  sound: SpeakerLoudIcon,
  vibrate: MobileIcon,
};

const notificationVariantLabel = {
  none: "Sound off",
  sound: "Sound on",
  vibrate: "Vibrate",
};
export default ChatHeader;
