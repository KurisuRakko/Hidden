import { format } from "date-fns";

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return format(new Date(value), "yyyy-MM-dd HH:mm");
}

export function formatRelativeState(value: boolean) {
  return value ? "Enabled" : "Disabled";
}
