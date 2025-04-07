/**
 * This file is definition types for the doctor data.
 * It provides data about doctors.
 * It is tailored to the specific needs of the project.
 */

export interface IDoctor {
  id: string; // Unique ID
  platform_id?: string; // Platform registration ID to generate certificate
  userId?: string; // User ID
  firstName: string;
  lastName: string;
  email: string;
  phone: number[];
  specialization: string[];
  degree: string[];
  experience: number;
  registrationNumber: string;
  clinic?: IClinicInfo[];
  availability?: IAvailability[];
  rating?: number;
  profileImage?: string;
  isVerified: boolean;
  status: EDoctorStatus;
  consultMode: EDoctorConsultMode[];
}

export interface IClinicInfo {
  id: string;
  name: string;
  address: IAddress[];
  contact: number[];
}

export interface IAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
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
