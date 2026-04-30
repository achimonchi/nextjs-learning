"use server";

import { inclusiveDaySpan } from "@/lib/calendar-date";
import type { OrdersDashboardPayload } from "./model";
import { getOrdersDashboardPayload } from "./repository";

export type LoadOrdersDashboardResult =
  | { ok: true; data: OrdersDashboardPayload }
  | { ok: false; message: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RANGE_DAYS = 366;

function isValidIanaTimeZone(timeZone: string): boolean {
  const trimmed = timeZone.trim();
  if (!trimmed || trimmed.length > 120) return false;
  try {
    Intl.DateTimeFormat("en-US", { timeZone: trimmed }).format();
    return true;
  } catch {
    return false;
  }
}

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value.trim())) return false;
  const [y, m, d] = value.trim().split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export async function loadOrdersDashboard(input: {
  timeZone: string;
  startDate: string;
  endDate: string;
}): Promise<LoadOrdersDashboardResult> {
  const timeZone = input.timeZone.trim();
  const startDate = input.startDate.trim();
  const endDate = input.endDate.trim();

  if (!isValidIanaTimeZone(timeZone)) {
    return { ok: false, message: "Invalid or unsupported time zone." };
  }
  if (!isValidIsoDate(startDate) || !isValidIsoDate(endDate)) {
    return { ok: false, message: "Start and end must be valid YYYY-MM-DD dates." };
  }
  if (startDate > endDate) {
    return { ok: false, message: "Start date must be on or before end date." };
  }
  if (inclusiveDaySpan(startDate, endDate) > MAX_RANGE_DAYS) {
    return {
      ok: false,
      message: `Date range cannot exceed ${MAX_RANGE_DAYS} days.`,
    };
  }

  try {
    const data = await getOrdersDashboardPayload({ timeZone, startDate, endDate });
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      message: "Could not load orders dashboard. Try again later.",
    };
  }
}
