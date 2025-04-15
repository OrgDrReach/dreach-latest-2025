import {
  format,
  parseISO,
  parse,
  isValid,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  addMinutes,
  addDays,
  isWeekend,
  startOfDay,
  endOfDay,
  isSameDay,
  isBefore,
  isAfter,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { enUS } from "date-fns/locale";
import { IDoctor, EDayOfWeek } from "@/types/doctor.d.types";
import {
  Provider,
  ITimeSlot,
  EProviderType,
  IBaseProvider,
} from "@/types/provider.d.types";

// Constants
export const TIMEZONE = "Asia/Kolkata";
export const UTC_TIMEZONE = "UTC";
export const DEFAULT_LOCALE = enUS;

// Interfaces
export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface WorkingHours {
  start: string;
  end: string;
}

// Type Guards
export const isDoctorProvider = (
  provider: Provider
): provider is IBaseProvider & IDoctor => {
  return provider.type === EProviderType.DOCTOR;
};

// Helper Functions
const convertToEDayOfWeek = (day: string): EDayOfWeek => {
  return EDayOfWeek[day as keyof typeof EDayOfWeek];
};

// Core Date Utility Class
export class DateUtils {
  private static instance: DateUtils;

  private constructor() {}

  public static getInstance(): DateUtils {
    if (!DateUtils.instance) {
      DateUtils.instance = new DateUtils();
    }
    return DateUtils.instance;
  }

  // Basic Date Formatting
  public formatDate(date: Date | string, formatStr: string = "PPP"): string {
    try {
      const parsedDate = typeof date === "string" ? parseISO(date) : date;
      if (!isValid(parsedDate)) {
        throw new Error("Invalid date");
      }
      return format(parsedDate, formatStr, { locale: DEFAULT_LOCALE });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  }

  public formatTime(time: Date | string, formatStr: string = "p"): string {
    try {
      const parsedTime = typeof time === "string" ? parseISO(time) : time;
      if (!isValid(parsedTime)) {
        throw new Error("Invalid time");
      }
      return format(parsedTime, formatStr, { locale: DEFAULT_LOCALE });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid Time";
    }
  }

  // Time Parsing and Conversion
  public parseTime(timeStr: string, formatPattern: string = "HH:mm"): Date {
    try {
      const parsedTime = parse(timeStr, formatPattern, new Date());
      if (!isValid(parsedTime)) {
        throw new Error("Invalid time string");
      }
      return parsedTime;
    } catch (error) {
      console.error("Error parsing time:", error);
      return new Date(NaN);
    }
  }

  public toLocalTime(utcDate: Date | string): Date {
    try {
      const date = typeof utcDate === "string" ? parseISO(utcDate) : utcDate;
      return toZonedTime(date, TIMEZONE);
    } catch (error) {
      console.error("Error converting to local time:", error);
      return new Date(NaN);
    }
  }

  public toUTCTime(localDate: Date | string): Date {
    try {
      const date = typeof localDate === "string" ? parseISO(localDate) : localDate;
      // Since zonedTimeToUtc is not available, we'll use a workaround
      const localDateTime = new Date(date);
      return new Date(
        Date.UTC(
          localDateTime.getFullYear(),
          localDateTime.getMonth(),
          localDateTime.getDate(),
          localDateTime.getHours(),
          localDateTime.getMinutes(),
          localDateTime.getSeconds(),
          localDateTime.getMilliseconds()
        )
      );
    } catch (error) {
      console.error("Error converting to UTC time:", error);
      return new Date(NaN);
    }
  }

  // Time Slot Management
  public generateTimeSlots(
    startTime: string,
    endTime: string,
    duration: number = 30,
    bookedSlots: string[] = []
  ): TimeSlot[] {
    try {
      const slots: TimeSlot[] = [];
      const start = this.parseTime(startTime);
      const end = this.parseTime(endTime);

      if (!isValid(start) || !isValid(end)) {
        throw new Error("Invalid time format");
      }

      let current = start;
      while (differenceInMinutes(end, current) >= duration) {
        const slotEnd = addMinutes(current, duration);
        const slotStartStr = format(current, "HH:mm", { locale: DEFAULT_LOCALE });
        const slotEndStr = format(slotEnd, "HH:mm", { locale: DEFAULT_LOCALE });

        slots.push({
          startTime: slotStartStr,
          endTime: slotEndStr,
          isAvailable: !bookedSlots.includes(slotStartStr),
        });

        current = slotEnd;
      }

      return slots;
    } catch (error) {
      console.error("Error generating time slots:", error);
      return [];
    }
  }

  public isTimeSlotAvailable(
    slot: TimeSlot,
    bookedSlots: { startTime: string; endTime: string }[]
  ): boolean {
    try {
      return !bookedSlots.some(
        (bookedSlot) =>
          (slot.startTime >= bookedSlot.startTime &&
            slot.startTime < bookedSlot.endTime) ||
          (slot.endTime > bookedSlot.startTime &&
            slot.endTime <= bookedSlot.endTime)
      );
    } catch (error) {
      console.error("Error checking time slot availability:", error);
      return false;
    }
  }

  public isTimeSlotWithinWorkingHours(
    slot: TimeSlot,
    workingHours: WorkingHours
  ): boolean {
    try {
      return (
        slot.startTime >= workingHours.start && slot.endTime <= workingHours.end
      );
    } catch (error) {
      console.error("Error checking time slot within working hours:", error);
      return false;
    }
  }

  // Date Utilities
  public getWeekDays(locale = DEFAULT_LOCALE): string[] {
    try {
      const baseDate = new Date(2024, 0, 1); // Using a Sunday as base
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        weekDays.push(
          format(addDays(baseDate, i), "EEEE", { locale })
        );
      }
      return weekDays;
    } catch (error) {
      console.error("Error getting week days:", error);
      return [];
    }
  }

  public formatDuration(minutes: number): string {
    try {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (hours === 0) {
        return `${minutes} minutes`;
      }
      if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? "s" : ""}`;
      }
      return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minutes`;
    } catch (error) {
      console.error("Error formatting duration:", error);
      return "Invalid Duration";
    }
  }

  public getTimeRangeString(startTime: string, endTime: string): string {
    try {
      const start = this.parseTime(startTime);
      const end = this.parseTime(endTime);
      if (!isValid(start) || !isValid(end)) {
        throw new Error("Invalid time format");
      }
      return `${format(start, "h:mm a", { locale: DEFAULT_LOCALE })} - ${format(
        end,
        "h:mm a",
        { locale: DEFAULT_LOCALE }
      )}`;
    } catch (error) {
      console.error("Error getting time range string:", error);
      return "Invalid Time Range";
    }
  }

  public getAppointmentDuration(startTime: string, endTime: string): number {
    try {
      const start = this.parseTime(startTime);
      const end = this.parseTime(endTime);
      if (!isValid(start) || !isValid(end)) {
        throw new Error("Invalid time format");
      }
      return differenceInMinutes(end, start);
    } catch (error) {
      console.error("Error calculating appointment duration:", error);
      return 0;
    }
  }

  // Relative Time Formatting
  public formatRelativeTime(timestamp: string | Date): string {
    try {
      const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
      if (!isValid(date)) {
        throw new Error("Invalid date");
      }

      const now = new Date();
      const diffInMinutes = Math.floor(
        Math.abs(now.getTime() - date.getTime()) / (1000 * 60)
      );
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays < 7) return `${diffInDays}d ago`;

      return this.formatDate(date);
    } catch (error) {
      console.error("Error formatting relative time:", error);
      return "Invalid Date";
    }
  }

  // Date Comparison
  public isSameDay(dateA: Date | string, dateB: Date | string): boolean {
    try {
      const dateObjA = typeof dateA === "string" ? parseISO(dateA) : dateA;
      const dateObjB = typeof dateB === "string" ? parseISO(dateB) : dateB;
      return isSameDay(dateObjA, dateObjB);
    } catch (error) {
      console.error("Error comparing dates:", error);
      return false;
    }
  }

  public isWeekend(date: Date | string): boolean {
    try {
      const dateObj = typeof date === "string" ? parseISO(date) : date;
      return isWeekend(dateObj);
    } catch (error) {
      console.error("Error checking weekend:", error);
      return false;
    }
  }

  public isFutureDate(date: Date | string): boolean {
    try {
      const dateObj = typeof date === "string" ? parseISO(date) : date;
      return isAfter(dateObj, new Date());
    } catch (error) {
      console.error("Error checking future date:", error);
      return false;
    }
  }

  public isPastDate(date: Date | string): boolean {
    try {
      const dateObj = typeof date === "string" ? parseISO(date) : date;
      return isBefore(dateObj, new Date());
    } catch (error) {
      console.error("Error checking past date:", error);
      return false;
    }
  }
}

// Appointment Duration Constants
export const appointmentDurations = {
  DEFAULT: 30,
  CONSULTATION: 30,
  CHECKUP: 45,
  PROCEDURE: 60,
  SURGERY_CONSULTATION: 45,
  THERAPY: 60,
  COUNSELING: 50,
} as const;

export type AppointmentDuration =
  (typeof appointmentDurations)[keyof typeof appointmentDurations];

// Export singleton instance
export const dateUtils = DateUtils.getInstance();

// Helper function for getting available slots
export const getAvailableSlotsForDate = (
  provider: Provider,
  date: Date
): ITimeSlot[] => {
  try {
    const dayOfWeek = convertToEDayOfWeek(
      format(date, "EEEE", { locale: DEFAULT_LOCALE }).toUpperCase()
    );

    if (isDoctorProvider(provider)) {
      return (
        provider.availability?.find((avail) => avail.day.includes(dayOfWeek))
          ?.slots || []
      );
    }

    const dayType = dateUtils.isWeekend(date) ? "weekends" : "regular";
    return provider.operatingHours[dayType] ? [provider.operatingHours[dayType]] : [];
  } catch (error) {
    console.error("Error getting available slots:", error);
    return [];
  }
};
