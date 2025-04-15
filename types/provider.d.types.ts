import {
	IDoctor,
	EDoctorStatus,
	EClinicRole,
	EClinicPermissions,
	IClinicStaff,
	EStaffStatus,
} from "./doctor.d.types";
import { Ambulance, EAmbulanceStatus } from "./ambulance.d.types";
import {
	Hospital,
	EHospitalStatus,
	EHospitalStaffRole,
	EHospitalSpecialization,
} from "./hospital.d.types";
import { Lab, ELabStatus } from "./lab.d.types";
import { Pharmaceutical, EPharmacyStatus } from "./pharmaceutical.d.types";

export enum EProviderType {
	DOCTOR = "doctors",
	HOSPITAL = "hospitals",
	AMBULANCE = "ambulance",
	LAB = "labs",
	PHARMACEUTICAL = "pharmaceuticals",
	CLINIC_STAFF = "clinic_staff",
}

export type ProviderType =
	| "doctor"
	| "hospital"
	| "laboratory"
	| "pharmacy"
	| "ambulance";

export type VerificationStatus =
	| "pending"
	| "pending_verification"
	| "verified"
	| "rejected"
	| "suspended";

export type DocumentType =
	| "medical_license"
	| "degree_certificate"
	| "specialization_certificate"
	| "identity_proof"
	| "address_proof"
	| "registration_certificate"
	| "facility_license"
	| "accreditation_certificate"
	| "equipment_certification"
	| "staff_credentials"
	| "insurance_documents";

export interface ProviderDocument {
	id: string;
	type: DocumentType;
	url: string;
	status: VerificationStatus;
	uploadedAt: string;
	verifiedAt?: string;
	comments?: string;
}

export interface Location {
	address: string;
	city: string;
	state: string;
	pincode: string;
	coordinates: {
		latitude: number;
		longitude: number;
	};
}

export interface ServiceTiming {
	day: number;
	slots: Array<{
		startTime: string;
		endTime: string;
		isAvailable: boolean;
	}>;
}

export interface DashboardProvider {
	id: string;
	userId: string;
	type: ProviderType;
	name: string;
	email: string;
	phone: string;
	profileImage?: string;
	specialization?: string;
	qualifications: string[];
	experience: number;
	consultationFee: number;
	location: Location;
	verificationStatus: VerificationStatus;
	documents: ProviderDocument[];
	schedule: ServiceTiming[];
	availableForHomeVisit: boolean;
	availableForVideoConsult: boolean;
	rating: number;
	totalRatings: number;
	createdAt: string;
	updatedAt: string;
}

export interface VerificationRequest {
	providerId: string;
	documents: ProviderDocument[];
	submittedAt: string;
	status: VerificationStatus;
	verifierComments?: string;
	verifiedAt?: string;
	verifiedBy?: string;
}

export interface ProviderSearchFilters {
	type?: ProviderType;
	specialization?: string;
	location?: {
		city?: string;
		state?: string;
		pincode?: string;
	};
	availability?: {
		day?: number;
		startTime?: string;
		endTime?: string;
	};
	services?: {
		homeVisit?: boolean;
		videoConsult?: boolean;
	};
	verificationStatus?: VerificationStatus;
	rating?: number;
	priceRange?: {
		min?: number;
		max?: number;
	};
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
	emergency?: {
		available: boolean;
		hours: ITimeSlot;
	};
	departments?: {
		[departmentId: string]: ITimeSlot;
	};
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
	departmentId?: string;
	staffId?: string;
	treatmentType?: string;
	visitType?: "INPATIENT" | "OUTPATIENT" | "EMERGENCY";
	verifiedVisit: boolean;
}

export type ProviderStatus =
	| EDoctorStatus
	| ELabStatus
	| EPharmacyStatus
	| EAmbulanceStatus
	| EStaffStatus
	| EHospitalStatus;

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
	role?: EClinicRole | EHospitalStaffRole;
	clinicId?: string;
	permissions?: EClinicPermissions[];
	specialization?: string[] | EHospitalSpecialization[];
	departments?: string[];
	staffRole?: {
		type: "CLINIC" | "HOSPITAL";
		role: EClinicRole | EHospitalStaffRole;
	};
}

export type Provider =
	| (IBaseProvider & IDoctor)
	| (IBaseProvider & Hospital)
	| (IBaseProvider & Ambulance)
	| (IBaseProvider & Lab)
	| (IBaseProvider & Pharmaceutical)
	| (IBaseProvider & IClinicStaff);
