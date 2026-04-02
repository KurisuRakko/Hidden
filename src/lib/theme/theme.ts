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

  return createTheme(
    {
      palette: {
        mode,
        primary: {
          main: isDark ? "#8ab4ff" : "#1f5da8",
          dark: isDark ? "#5f8fdd" : "#184885",
          light: isDark ? "#b4ceff" : "#5c86d1",
          contrastText: isDark ? "#08111d" : "#ffffff",
        },
        secondary: {
          main: isDark ? "#6bc9bc" : "#00695c",
          dark: isDark ? "#48a295" : "#004d43",
          light: isDark ? "#94e1d6" : "#3d9488",
          contrastText: isDark ? "#081614" : "#ffffff",
        },
        background: {
          default: isDark ? "#0f1318" : "#f3f1ec",
          paper: isDark ? "#171d24" : "#ffffff",
        },
        text: {
          primary: isDark ? "#eef2f7" : "#202227",
          secondary: isDark ? "#a9b4c2" : "#5f6470",
        },
        divider: isDark
          ? "rgba(238, 242, 247, 0.12)"
          : "rgba(32, 34, 39, 0.08)",
        success: {
          main: isDark ? "#66bb6a" : "#2e7d32",
        },
        warning: {
          main: isDark ? "#ffb74d" : "#ed6c02",
        },
        error: {
          main: isDark ? "#ef5350" : "#c62828",
        },
      },
      shape: {
        borderRadius: 4,
      },
      typography: {
        fontFamily:
          "var(--font-noto-sans-sc), var(--font-roboto), Roboto, sans-serif",
        h1: {
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
        },
        h2: {
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.08,
        },
        h3: {
          fontWeight: 700,
          letterSpacing: "-0.02em",
        },
        h4: {
          fontWeight: 700,
        },
        h5: {
          fontWeight: 700,
        },
        h6: {
          fontWeight: 600,
        },
        button: {
          fontWeight: 600,
          textTransform: "none",
          letterSpacing: 0,
        },
        subtitle1: {
          fontWeight: 600,
        },
      },
      shadows: [
        "none",
        "0px 1px 3px rgba(15, 22, 36, 0.12), 0px 1px 2px rgba(15, 22, 36, 0.08)",
        "0px 2px 6px rgba(15, 22, 36, 0.14), 0px 1px 3px rgba(15, 22, 36, 0.08)",
        "0px 4px 10px rgba(15, 22, 36, 0.12), 0px 2px 4px rgba(15, 22, 36, 0.08)",
        "0px 8px 24px rgba(15, 22, 36, 0.12), 0px 3px 8px rgba(15, 22, 36, 0.08)",
        "0px 10px 32px rgba(15, 22, 36, 0.14), 0px 6px 16px rgba(15, 22, 36, 0.1)",
        "0px 12px 36px rgba(15, 22, 36, 0.14), 0px 8px 18px rgba(15, 22, 36, 0.1)",
        "0px 14px 40px rgba(15, 22, 36, 0.14), 0px 10px 20px rgba(15, 22, 36, 0.1)",
        "0px 16px 44px rgba(15, 22, 36, 0.14), 0px 12px 24px rgba(15, 22, 36, 0.1)",
        "0px 18px 48px rgba(15, 22, 36, 0.14), 0px 14px 26px rgba(15, 22, 36, 0.1)",
        "0px 20px 52px rgba(15, 22, 36, 0.14), 0px 16px 28px rgba(15, 22, 36, 0.1)",
        "0px 22px 56px rgba(15, 22, 36, 0.14), 0px 18px 30px rgba(15, 22, 36, 0.1)",
        "0px 24px 60px rgba(15, 22, 36, 0.14), 0px 20px 32px rgba(15, 22, 36, 0.1)",
        "0px 26px 64px rgba(15, 22, 36, 0.14), 0px 22px 34px rgba(15, 22, 36, 0.1)",
        "0px 28px 68px rgba(15, 22, 36, 0.14), 0px 24px 36px rgba(15, 22, 36, 0.1)",
        "0px 30px 72px rgba(15, 22, 36, 0.14), 0px 26px 38px rgba(15, 22, 36, 0.1)",
        "0px 32px 76px rgba(15, 22, 36, 0.14), 0px 28px 40px rgba(15, 22, 36, 0.1)",
        "0px 34px 80px rgba(15, 22, 36, 0.14), 0px 30px 42px rgba(15, 22, 36, 0.1)",
        "0px 36px 84px rgba(15, 22, 36, 0.14), 0px 32px 44px rgba(15, 22, 36, 0.1)",
        "0px 38px 88px rgba(15, 22, 36, 0.14), 0px 34px 46px rgba(15, 22, 36, 0.1)",
        "0px 40px 92px rgba(15, 22, 36, 0.14), 0px 36px 48px rgba(15, 22, 36, 0.1)",
        "0px 42px 96px rgba(15, 22, 36, 0.14), 0px 38px 50px rgba(15, 22, 36, 0.1)",
        "0px 44px 100px rgba(15, 22, 36, 0.14), 0px 40px 52px rgba(15, 22, 36, 0.1)",
        "0px 46px 104px rgba(15, 22, 36, 0.14), 0px 42px 54px rgba(15, 22, 36, 0.1)",
        "0px 48px 108px rgba(15, 22, 36, 0.14), 0px 44px 56px rgba(15, 22, 36, 0.1)",
      ],
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
          styleOverrides: {
            root: {
              backgroundImage: "none",
              backgroundColor: isDark ? "#171d24" : "#ffffff",
              color: isDark ? "#eef2f7" : "#202227",
              transition:
                "background-color var(--motion-base) var(--ease-standard), box-shadow var(--motion-base) var(--ease-standard)",
            },
          },
        },
        MuiButton: {
          defaultProps: {
            disableElevation: false,
          },
          styleOverrides: {
            root: {
              minHeight: 44,
              paddingInline: 18,
              borderRadius: 8,
              transition:
                "transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard), background-color var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard)",
              boxShadow: isDark
                ? "0 1px 2px rgba(0, 0, 0, 0.22)"
                : "0 1px 2px rgba(15, 22, 36, 0.03)",
              "&:active": {
                transform: "translateY(1px) scale(0.985)",
              },
              "&:focus-visible": {
                boxShadow: `0 0 0 3px ${alpha(
                  isDark ? "#8ab4ff" : "#1f5da8",
                  0.22,
                )}`,
              },
              "@media (max-width:599.95px)": {
                minHeight: 46,
                paddingInline: 16,
              },
              "@media (hover: hover)": {
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              transition:
                "transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard), background-color var(--motion-fast) var(--ease-standard)",
              "&:focus-visible": {
                boxShadow: `0 0 0 3px ${alpha(
                  isDark ? "#8ab4ff" : "#1f5da8",
                  0.22,
                )}`,
              },
              "&:active": {
                transform: "scale(0.96)",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: isDark
                ? "0px 12px 30px rgba(0, 0, 0, 0.24), 0px 2px 10px rgba(0, 0, 0, 0.18)"
                : "0px 6px 18px rgba(15, 22, 36, 0.07), 0px 2px 6px rgba(15, 22, 36, 0.04)",
              border: `1px solid ${
                isDark ? "rgba(238, 242, 247, 0.08)" : "rgba(32, 34, 39, 0.06)"
              }`,
              overflow: "hidden",
              transition:
                "transform var(--motion-base) var(--ease-standard), box-shadow var(--motion-base) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard)",
              "@media (hover: hover)": {
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: isDark
                    ? "0px 16px 36px rgba(0, 0, 0, 0.3), 0px 6px 16px rgba(0, 0, 0, 0.2)"
                    : "0px 10px 24px rgba(15, 22, 36, 0.1), 0px 4px 12px rgba(15, 22, 36, 0.06)",
                },
              },
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
              backgroundColor: isDark ? alpha("#ffffff", 0.03) : "#ffffff",
              minHeight: 48,
              transition:
                "background-color var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard)",
              "&:hover": {
                backgroundColor: isDark ? alpha("#ffffff", 0.04) : "#ffffff",
              },
              "&.Mui-focused": {
                boxShadow: `0 0 0 4px ${alpha(
                  isDark ? "#8ab4ff" : "#1f5da8",
                  0.16,
                )}`,
              },
              "@media (max-width:599.95px)": {
                minHeight: 50,
              },
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
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 18,
              color: isDark ? "#a9b4c2" : "#5f6470",
              transition:
                "color var(--motion-fast) var(--ease-standard), background-color var(--motion-fast) var(--ease-standard), transform var(--motion-fast) var(--ease-standard)",
              "&.Mui-selected": {
                color: isDark ? "#8ab4ff" : "#1f5da8",
                backgroundColor: alpha(
                  isDark ? "#8ab4ff" : "#1f5da8",
                  isDark ? 0.14 : 0.08,
                ),
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            },
            label: {
              fontSize: "0.72rem",
              fontWeight: 600,
              "&.Mui-selected": {
                fontSize: "0.72rem",
              },
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              transition:
                "transform var(--motion-base) var(--ease-standard), opacity var(--motion-base) var(--ease-standard), background-color var(--motion-fast) var(--ease-standard)",
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 999,
              transition:
                "transform var(--motion-fast) var(--ease-standard), background-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard)",
            },
          },
        },
      },
    },
    locale === "zh-CN" ? zhCN : enUS,
  );
}

export const appTheme = createAppTheme("light");
