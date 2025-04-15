import { z } from "zod";
import {
	AppointmentStatus,
	ConsultationType,
} from "@/types/appointment.d.types";
import { EUserRole } from "@/types/user.d.types";

// Auth Schemas
export const loginSchema = z.object({
	phone: z.string().min(10).max(15),
	password: z.string().min(6),
});

export const registerSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	phone: z.string().min(10).max(15),
	password: z.string().min(6),
	role: z.nativeEnum(EUserRole),
});

// Appointment Schemas
export const appointmentSchema = z.object({
	patientId: z.string().uuid(),
	providerId: z.string().uuid(),
	date: z.string().datetime(),
	startTime: z.string(),
	endTime: z.string(),
	status: z.nativeEnum(AppointmentStatus),
	consultationType: z.nativeEnum(ConsultationType),
	symptoms: z.string().optional(),
	notes: z.string().optional(),
});

export const appointmentAvailabilitySchema = z.object({
	providerId: z.string().uuid(),
	date: z.string().datetime(),
});

// Provider Schemas
export const providerProfileSchema = z.object({
	name: z.string().min(2),
	specialization: z.string().optional(),
	qualifications: z.array(z.string()),
	experience: z.number().min(0),
	consultationFee: z.number().min(0),
	availableForHomeVisit: z.boolean(),
	availableForVideoConsult: z.boolean(),
	location: z.object({
		address: z.string(),
		city: z.string(),
		state: z.string(),
		pincode: z.string(),
		coordinates: z.object({
			latitude: z.number(),
			longitude: z.number(),
		}),
	}),
});

// Review Schema
export const reviewSchema = z.object({
	providerId: z.string().uuid(),
	rating: z.number().min(1).max(5),
	comment: z.string().optional(),
});

// Schedule Schema
export const scheduleSchema = z.object({
	providerId: z.string().uuid(),
	weeklySchedule: z.array(
		z.object({
			day: z.number().min(0).max(6),
			slots: z.array(
				z.object({
					startTime: z.string(),
					endTime: z.string(),
					isAvailable: z.boolean(),
				})
			),
		})
	),
});

// Medical Record Schema
export const medicalRecordSchema = z.object({
	patientId: z.string().uuid(),
	providerId: z.string().uuid(),
	appointmentId: z.string().uuid(),
	diagnosis: z.string(),
	prescription: z.array(
		z.object({
			medicine: z.string(),
			dosage: z.string(),
			duration: z.string(),
			instructions: z.string().optional(),
		})
	),
	notes: z.string().optional(),
	attachments: z.array(z.string()).optional(),
});
