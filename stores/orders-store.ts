import { create } from "zustand";
import type { OrderSummary, PieSlice, TimelinePoint, TimelineUnit } from "@/modules/sales/model";
import { calendarDateInTimeZone } from "@/lib/calendar-date";
import { loadOrdersDashboard } from "@/modules/sales/usecase";

export type OrdersDashboardFilters = {
  timeZone: string;
  startDate: string;
  endDate: string;
};

type OrdersStore = {
  topOrders: OrderSummary[];
  pieByChannel: PieSlice[];
  timeline: TimelinePoint[];
  timelineUnit: TimelineUnit;
  dashboardTimeZone: string;
  startDate: string;
  endDate: string;
  error: string | null;
  isPending: boolean;
  loadDashboard: (filters: OrdersDashboardFilters) => Promise<void>;
};

function defaultTimeZone(): string {
  if (typeof Intl !== "undefined") {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "UTC";
    }
  }
  return "UTC";
}

function defaultDateRangeForZone(timeZone: string): { startDate: string; endDate: string } {
  const today = calendarDateInTimeZone(timeZone);
  return { startDate: today, endDate: today };
}

const tz0 = defaultTimeZone();
const range0 = defaultDateRangeForZone(tz0);

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  topOrders: [],
  pieByChannel: [],
  timeline: [],
  timelineUnit: "hour",
  dashboardTimeZone: tz0,
  startDate: range0.startDate,
  endDate: range0.endDate,
  error: null,
  isPending: true,

  loadDashboard: async (filters: OrdersDashboardFilters) => {
    const tz = filters.timeZone.trim() || get().dashboardTimeZone;
    const startDate = filters.startDate.trim() || get().startDate;
    const endDate = filters.endDate.trim() || get().endDate;

    set({
      isPending: true,
      error: null,
      dashboardTimeZone: tz,
      startDate,
      endDate,
    });

    const res = await loadOrdersDashboard({ timeZone: tz, startDate, endDate });
    if (res.ok) {
      set({
        topOrders: res.data.top_orders,
        pieByChannel: res.data.pie_by_channel,
        timeline: res.data.timeline,
        timelineUnit: res.data.timeline_unit,
        dashboardTimeZone: tz,
        startDate,
        endDate,
        isPending: false,
      });
    } else {
      set({
        topOrders: [],
        pieByChannel: [],
        timeline: [],
        timelineUnit: "hour",
        error: res.message,
        isPending: false,
      });
    }
  },
}));
