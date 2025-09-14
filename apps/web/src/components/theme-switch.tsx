import { useTheme } from "#/context/theme-context";
import { Button } from "#components/ui/button";
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
      className="scale-95 rounded-full text-gray-700 dark:text-gray-100 bg-transparent dark:bg-neutral-800/60 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700"
      aria-label="Tema değiştir"
      title="Tema değiştir"
    >
      {isDarkDom ? (
        <IconMoon className="size-[1.2rem]" stroke={2.2} />
      ) : (
        <IconSun className="size-[1.2rem]" stroke={2.2} />
      )}
    </Button>
  );
}
