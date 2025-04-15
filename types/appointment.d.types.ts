export enum EAppointmentMode {
	VIDEO = "video",
	IN_PERSON = "in_person",
	HOME_VISIT = "home_visit",
}

export enum EAppointmentStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
	CANCELLED = "cancelled",
	COMPLETED = "completed",
	RESCHEDULED = "rescheduled",
}

export interface AppointmentType {
	id?: string;
	patientId: string;
	providerId: string;
	date: string;
	startTime: string;
	endTime: string;
	status: EAppointmentStatus;
	consultationType: EAppointmentMode;
	symptoms?: string;
	notes?: string;
	prescriptionId?: string;
	paymentStatus?: "pending" | "completed";
	paymentId?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface AppointmentSlot {
	startTime: string;
	endTime: string;
	isAvailable: boolean;
}

export interface DailySchedule {
	date: string;
	slots: AppointmentSlot[];
}

export interface AppointmentAvailability {
	providerId: string;
	schedule: DailySchedule[];
}

export interface AppointmentFilters {
	startDate?: string;
	endDate?: string;
	status?: EAppointmentStatus;
	consultationType?: EAppointmentMode;
	providerId?: string;
	patientId?: string;
}

export interface RescheduleRequest {
	appointmentId: string;
	newDate: string;
	newStartTime: string;
	newEndTime: string;
	reason?: string;
}

export interface CancellationRequest {
	appointmentId: string;
	reason: string;
}

export interface AppointmentFeedback {
	appointmentId: string;
	rating: number;
	comment?: string;
	providerId: string;
	patientId: string;
}
