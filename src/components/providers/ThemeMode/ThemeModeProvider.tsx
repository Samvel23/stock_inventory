import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import {
  themeModes,
  type TThemeMode,
  type TResolvedThemeMode,
} from "@/theme/theme";
import { ThemeModeContext } from "@/context";

interface IThemeModeProviderProps {
  children: ReactNode;
}

const THEME_MODE_KEY = "theme-mode";

const getInitialMode = (): TThemeMode => {
  try {
    const savedMode = localStorage.getItem(THEME_MODE_KEY);

    if (
      savedMode === themeModes.light ||
      savedMode === themeModes.dark ||
      savedMode === themeModes.system
    ) {
      return savedMode;
    }
  } catch {
    return themeModes.system;
  }

  return themeModes.system;
};

const getSystemMode = (): TResolvedThemeMode =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeModeProvider = ({ children }: IThemeModeProviderProps) => {
  const [mode, setMode] = useState<TThemeMode>(getInitialMode);
  const [systemMode, setSystemMode] =
    useState<TResolvedThemeMode>(getSystemMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemModeChange = (event: MediaQueryListEvent) => {
      setSystemMode(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleSystemModeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemModeChange);
    };
  }, []);

  const resolvedMode: TResolvedThemeMode =
    mode === themeModes.system ? systemMode : mode;

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedMode;
    document.documentElement.style.colorScheme = resolvedMode;
  }, [resolvedMode]);

  const changeMode = useCallback((nextMode: TThemeMode) => {
    setMode(nextMode);

    try {
      localStorage.setItem(THEME_MODE_KEY, nextMode);
    } catch {
      // Theme changes should work even when browser storage is unavailable.
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      resolvedMode,
      changeMode,
    }),
    [mode, resolvedMode, changeMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};
