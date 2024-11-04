import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  const Icon = theme !== "dark" ? MoonIcon : SunIcon;
  const handleThemeChange = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle color mode"
      onClick={handleThemeChange}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
