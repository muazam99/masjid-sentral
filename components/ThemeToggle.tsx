"use client"

import { Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className="flex items-center">
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        className="mr-2"
      />
      <span className="sr-only">Toggle theme</span>
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </div>
  )
}

