import { createContext } from "react";

import type { TResolvedThemeMode, TThemeMode } from "@/theme/theme";

interface IThemeModeContextValue {
  mode: TThemeMode;
  resolvedMode: TResolvedThemeMode;
  changeMode: (mode: TThemeMode) => void;
}

export const ThemeModeContext = createContext<
  IThemeModeContextValue | undefined
>(undefined);
