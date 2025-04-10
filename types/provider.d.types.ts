import { Ambulance, EAmbulanceStatus } from "./ambulance.d.types";
import { IDoctor, EDoctorStatus } from "./doctor.d.types";
import { Hospital } from "./hospital.d.types";
import { Lab, ELabStatus } from "./lab.d.types";
import { Pharmaceutical, EPharmacyStatus } from "./pharmaceutical.d.types";

export enum EProviderType {
  DOCTOR = "doctors",
  HOSPITAL = "hospitals",
  AMBULANCE = "ambulance",
  LAB = "labs",
  PHARMACEUTICAL = "pharmaceuticals",
}

export interface IAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ITimeSlot {
  startTime: string;
  endTime: string;
}

export interface IOperatingHours {
  regular: ITimeSlot;
  weekends?: ITimeSlot;
  holidays?: ITimeSlot;
}

export interface IContactInfo {
  phone: string[];
  email: string;
  website?: string;
  emergencyContact?: string;
}

export interface IReview {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export type ProviderStatus =
  | EDoctorStatus
  | ELabStatus
  | EPharmacyStatus
  | EAmbulanceStatus;

export interface IBaseProvider {
  id: string;
  type: EProviderType;
  name: string;
  address: IAddress[];
  contact: IContactInfo;
  operatingHours: IOperatingHours;
  rating?: number;
  reviews?: IReview[];
  isVerified: boolean;
  status: ProviderStatus;
}

export type Provider =
  | (IBaseProvider & IDoctor)
  | (IBaseProvider & Hospital)
  | (IBaseProvider & Ambulance)
  | (IBaseProvider & Lab)
  | (IBaseProvider & Pharmaceutical);
