import { format } from "date-fns";

export function uiDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}