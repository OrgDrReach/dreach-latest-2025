export enum EProviderType {
  DOCTOR = "doctors",
  HOSPITAL = "hospitals",
  AMBULANCE = "ambulance",
  LAB = "labs",
  PHARMACEUTICAL = "pharmaceuticals",
}

export interface IProvider {
  id: string;
  type: EProviderType;
  name: string;
  address: IAddress[];
  contact: IContactInfo;
  operatingHours: IOperatingHours;
  status: EProviderStatus;
  rating?: number;
  reviews?: IReview[];
  isVerified: boolean;
}

export interface IContactInfo {
  phone: string[];
  email: string;
  website?: string;
  emergencyContact?: string;
}

export interface IOperatingHours {
  regular: ITimeSlot;
  weekends?: ITimeSlot;
  holidays?: ITimeSlot;
}

export interface IReview {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export enum EProviderStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
}
