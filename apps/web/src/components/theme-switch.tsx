import { Button } from "#components/ui/button";
import { useTheme } from "#context/theme-context";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [isDarkDom, setIsDarkDom] = useState<boolean>(false);

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = "#fff";
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute("content", themeColor);
    setIsDarkDom(document.documentElement.classList.contains("dark"));
  }, [theme]);

  const handleToggle = () => {
    const root = window.document.documentElement;
    const effective = theme === "system" ? (root.classList.contains("dark") ? "dark" : "light") : theme;
    const next = effective === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="scale-95 rounded-full hover:bg-gray-100 text-gray-800"
      aria-label="Tema değiştir"
      title="Tema değiştir"
    >
      {isDarkDom ? (
        <IconMoon className="size-[1.2rem] text-gray-800" stroke={2.2} />
      ) : (
        <IconSun className="size-[1.2rem] text-gray-800" stroke={2.2} />
      )}
    </Button>
  );
}
