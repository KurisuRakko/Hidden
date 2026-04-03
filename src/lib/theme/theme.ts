import { PaletteMode } from "@mui/material";
import { enUS, zhCN } from "@mui/material/locale";
import { alpha, createTheme } from "@mui/material/styles";
import { LinkBehavior } from "@/components/common/link-behavior";
import { type Locale } from "@/lib/i18n";

export function createAppTheme(
  mode: PaletteMode = "light",
  locale: Locale = "en",
) {
  const isDark = mode === "dark";
  const primaryMain = isDark ? "#90caf9" : "#1976d2";
  const secondaryMain = isDark ? "#ce93d8" : "#9c27b0";

  return createTheme(
    {
      palette: {
        mode,
        primary: {
          main: primaryMain,
          light: isDark ? "#e3f2fd" : "#42a5f5",
          dark: isDark ? "#42a5f5" : "#115293",
          contrastText: isDark ? "#0a1929" : "#ffffff",
        },
        secondary: {
          main: secondaryMain,
          light: isDark ? "#f3e5f5" : "#ba68c8",
          dark: isDark ? "#ab47bc" : "#6d1b7b",
          contrastText: "#ffffff",
        },
        background: {
          default: isDark ? "#121212" : "#fafafa",
          paper: isDark ? "#1e1e1e" : "#ffffff",
        },
        text: {
          primary: isDark ? "rgba(255, 255, 255, 0.92)" : "rgba(0, 0, 0, 0.87)",
          secondary: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
        },
        divider: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
        success: {
          main: isDark ? "#81c784" : "#2e7d32",
        },
        warning: {
          main: isDark ? "#ffb74d" : "#ed6c02",
        },
        error: {
          main: isDark ? "#ef9a9a" : "#d32f2f",
        },
      },
      shape: {
        borderRadius: 8,
      },
      typography: {
        fontFamily:
          "var(--font-noto-sans-sc), var(--font-roboto), Roboto, sans-serif",
        h1: {
          fontWeight: 500,
          letterSpacing: "-0.015em",
          lineHeight: 1.12,
        },
        h2: {
          fontWeight: 500,
          letterSpacing: "-0.01em",
          lineHeight: 1.16,
        },
        h3: {
          fontWeight: 500,
          lineHeight: 1.2,
        },
        h4: {
          fontWeight: 500,
          lineHeight: 1.25,
        },
        h5: {
          fontWeight: 500,
          lineHeight: 1.3,
        },
        h6: {
          fontWeight: 500,
          lineHeight: 1.35,
        },
        button: {
          fontWeight: 500,
          textTransform: "none",
          letterSpacing: 0,
        },
        subtitle1: {
          fontWeight: 500,
        },
      },
      components: {
        MuiButtonBase: {
          defaultProps: {
            LinkComponent: LinkBehavior,
          },
        },
        MuiLink: {
          defaultProps: {
            component: LinkBehavior,
          },
        },
        MuiAppBar: {
          defaultProps: {
            elevation: 0,
          },
          styleOverrides: {
            root: {
              backgroundImage: "none",
              backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
              color: isDark ? "rgba(255, 255, 255, 0.92)" : "rgba(0, 0, 0, 0.87)",
              borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
              transition:
                "background-color var(--motion-base) var(--ease-standard), color var(--motion-base) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard)",
            },
          },
        },
        MuiButton: {
          defaultProps: {
            disableElevation: false,
          },
          styleOverrides: {
            root: {
              minHeight: 40,
              borderRadius: 4,
              paddingInline: 16,
              transition:
                "background-color var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out)",
              "&:focus-visible": {
                boxShadow: `0 0 0 3px ${alpha(primaryMain, 0.22)}`,
              },
            },
            contained: {
              boxShadow: isDark ? "0 1px 3px rgba(0, 0, 0, 0.36)" : "0 1px 3px rgba(0, 0, 0, 0.24)",
              "&:hover": {
                boxShadow: isDark ? "0 2px 5px rgba(0, 0, 0, 0.4)" : "0 2px 6px rgba(0, 0, 0, 0.28)",
              },
              "&:active": {
                boxShadow: isDark ? "0 1px 2px rgba(0, 0, 0, 0.32)" : "0 1px 2px rgba(0, 0, 0, 0.24)",
                transform: "scale(0.97)"
              },
            },
            outlined: {
              borderWidth: 1,
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              borderRadius: 999,
              transition:
                "background-color var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out)",
              "&:focus-visible": {
                boxShadow: `0 0 0 3px ${alpha(primaryMain, 0.22)}`,
              },
              "&:active": {
                transform: "scale(0.95)"
              },
            },
          },
        },
        MuiFab: {
          styleOverrides: {
            root: {
              boxShadow: isDark ? "0 4px 10px rgba(0, 0, 0, 0.4)" : "0 3px 8px rgba(0, 0, 0, 0.24)",
              transition:
                "background-color var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out)",
              "&:hover": {
                boxShadow: isDark ? "0 6px 14px rgba(0, 0, 0, 0.46)" : "0 5px 12px rgba(0, 0, 0, 0.28)",
              },
              "&:active": {
                transform: "scale(0.95)"
              },
            },
          },
        },
        MuiCardActionArea: {
          styleOverrides: {
            root: {
              transition:
                "background-color var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out)",
              "&:active": {
                transform: "scale(0.98)"
              },
            },
          },
        },
        MuiCard: {
          defaultProps: {
            elevation: 1,
          },
          styleOverrides: {
            root: {
              borderRadius: 8,
              backgroundImage: "none",
              border: "none",
              transition:
                "box-shadow var(--motion-fast) var(--ease-out), background-color var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              minHeight: 56,
              borderRadius: 4,
              backgroundColor: isDark ? alpha("#ffffff", 0.02) : "#ffffff",
              transition:
                "background-color var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard)",
              "&.Mui-focused": {
                boxShadow: `0 0 0 2px ${alpha(primaryMain, 0.18)}`,
              },
            },
            notchedOutline: {
              borderColor: isDark ? "rgba(255, 255, 255, 0.22)" : "rgba(0, 0, 0, 0.23)",
            },
          },
        },
        MuiBottomNavigation: {
          styleOverrides: {
            root: {
              backgroundColor: "transparent",
              minHeight: "var(--mobile-nav-height)",
            },
          },
        },
        MuiBottomNavigationAction: {
          styleOverrides: {
            root: {
              minWidth: 0,
              paddingTop: 8,
              paddingBottom: 8,
              color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
              transition:
                "color var(--motion-fast) var(--ease-standard), background-color var(--motion-fast) var(--ease-standard)",
              "&.Mui-selected": {
                color: primaryMain,
              },
            },
            label: {
              fontSize: "0.75rem",
              fontWeight: 500,
              "&.Mui-selected": {
                fontSize: "0.75rem",
              },
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: 4,
              transition:
                "opacity var(--motion-base) var(--ease-standard), background-color var(--motion-fast) var(--ease-standard)",
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              transition:
                "background-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard)",
            },
          },
        },
      },
    },
    locale === "zh-CN" ? zhCN : enUS,
  );
}

export const appTheme = createAppTheme("light");
