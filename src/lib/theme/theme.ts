import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f5da8",
      dark: "#184885",
      light: "#5c86d1",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00695c",
      dark: "#004d43",
      light: "#3d9488",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f3f1ec",
      paper: "#ffffff",
    },
    text: {
      primary: "#202227",
      secondary: "#5f6470",
    },
    divider: "rgba(32, 34, 39, 0.08)",
    success: {
      main: "#2e7d32",
    },
    warning: {
      main: "#ed6c02",
    },
    error: {
      main: "#c62828",
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: "var(--font-roboto), Roboto, sans-serif",
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#ffffff",
          color: "#202227",
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
          minHeight: 42,
          paddingInline: 18,
          borderRadius: 8,
          transition:
            "transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard), background-color var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard)",
          "&:active": {
            transform: "translateY(1px) scale(0.985)",
          },
          "&:focus-visible": {
            boxShadow: "0 0 0 3px rgba(31, 93, 168, 0.18)",
          },
          "@media (hover: hover)": {
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            "0px 8px 24px rgba(15, 22, 36, 0.08), 0px 2px 6px rgba(15, 22, 36, 0.05)",
          border: "1px solid rgba(32, 34, 39, 0.06)",
          transition:
            "transform var(--motion-base) var(--ease-standard), box-shadow var(--motion-base) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard)",
          "@media (hover: hover)": {
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow:
                "0px 14px 34px rgba(15, 22, 36, 0.12), 0px 4px 12px rgba(15, 22, 36, 0.08)",
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
          backgroundColor: "#ffffff",
          transition:
            "background-color var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard)",
          "&:hover": {
            backgroundColor: "#ffffff",
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 4px rgba(31, 93, 168, 0.12)",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
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
});
