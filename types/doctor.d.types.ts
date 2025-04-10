/**
 * This file is definition types for the doctor data.
 * It provides data about doctors.
 * It is tailored to the specific needs of the project.
 */

import { IAddress, IContactInfo } from "./provider.d.types";

export interface IDoctor {
  id: string; // Unique ID
  platform_id?: string; // Platform registration ID to generate certificate
  userId?: string; // User ID
  firstName: string;
  lastName: string;
  specialization: string[];
  degree: string[];
  experience: number;
  registrationNumber: string;
  clinic?: IClinicInfo[];
  availability?: IAvailability[];
  profileImage?: string;
  isVerified: boolean;
  status: EDoctorStatus;
  consultMode: EDoctorConsultMode[];
  consultationFee?: number; // Add this optional property
}

export interface IClinicInfo {
  id: string;
  name: string;
  address: IAddress[];
  contact: IContactInfo[];
}

export interface IAvailability {
  day: EDayOfWeek[];
  slots: ITimeSlot[];
}

export interface ITimeSlot {
  startTime: string;
  endTime: string;
}

export enum EDayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

export enum EDoctorStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  SUSPENDED = "SUSPENDED",
  VERIFY = "VERIFY",
  ACTIVATE = "ACTIVATE",
}

export enum EDoctorConsultMode {
  HOME_VISIT = "HOME_VISIT",
  CLINIC = "CLINIC",
  VIDEO_CONSULT = "VIDEO_CONSULT",
  HYBRID = "HYBRID",
}

// Add this new interface for featured doctors
export interface IFeaturedDoctor extends IDoctor {
  nextAvailable: string;
  availableSlots: number;
  consultationFee: number; // Make it required for featured doctors
  isBookmarked?: boolean;
  address: IAddress[];
  contact: IContactInfo[];
  featured: boolean;
  rating: number;
  totalRatings?: number;
  nextAvailableSlot?: {
    date: string;
    time: string;
  };
  languages?: string[];
}
