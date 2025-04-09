import {
	EDayOfWeek,
	EDoctorConsultMode,
	EDoctorStatus,
	IDoctor,
} from "../types/doctor.d.types";
import {
	EProviderType,
	IBaseProvider,
	Provider,
} from "../types/provider.d.types";

export const doctors: Provider[] = [
	{
		// Base Provider Properties
		id: "DOC001",
		type: EProviderType.DOCTOR,
		name: "Dr. John Smith",
		address: [
			{
				id: "ADD001",
				street: "123 Medical Drive",
				city: "Boston",
				state: "Massachusetts",
				country: "USA",
				postalCode: "02108",
			},
		],
		contact: {
			phone: ["+1-617-555-0123", "+1-617-555-0124"],
			email: "john.smith@healthcare.com",
			website: "www.drjohnsmith.com",
			emergencyContact: "+1-617-555-0125",
		},
		operatingHours: {
			regular: {
				startTime: "09:00",
				endTime: "17:00",
			},
			weekends: {
				startTime: "10:00",
				endTime: "14:00",
			},
		},
		rating: 4.8,
		reviews: [
			{
				id: "REV001",
				userId: "USR001",
				rating: 5,
				comment: "Excellent doctor, very thorough and professional",
				createdAt: new Date("2025-03-15"),
			},
		],
		isVerified: true,
		status: EDoctorStatus.ONLINE,

		// Doctor Specific Properties
		platform_id: "PLAT001",
		userId: "USR001",
		firstName: "John",
		lastName: "Smith",
		specialization: ["Cardiology", "Internal Medicine"],
		degree: ["MD", "FACC"],
		experience: 15,
		registrationNumber: "MED123456",
		clinic: [
			{
				id: "CLN001",
				name: "Boston Heart Clinic",
				address: [
					{
						id: "CLNADD001",
						street: "123 Medical Drive",
						city: "Boston",
						state: "Massachusetts",
						country: "USA",
						postalCode: "02108",
					},
				],
				contact: [
					{
						phone: ["+1-617-555-0123"],
						email: "clinic@bostonheart.com",
						website: "www.bostonheartclinic.com",
					},
				],
			},
		],
		availability: [
			{
				day: [EDayOfWeek.MONDAY, EDayOfWeek.WEDNESDAY, EDayOfWeek.FRIDAY],
				slots: [
					{
						startTime: "09:00",
						endTime: "13:00",
					},
					{
						startTime: "14:00",
						endTime: "17:00",
					},
				],
			},
		],
		profileImage: "https://example.com/doctors/john-smith.jpg",
		consultMode: [EDoctorConsultMode.CLINIC, EDoctorConsultMode.VIDEO_CONSULT],
	},
	{
		// Second Doctor
		id: "DOC002",
		type: EProviderType.DOCTOR,
		name: "Dr. Sarah Johnson",
		address: [
			{
				id: "ADD002",
				street: "456 Healthcare Avenue",
				city: "San Francisco",
				state: "California",
				country: "USA",
				postalCode: "94105",
			},
		],
		contact: {
			phone: ["+1-415-555-0123"],
			email: "sarah.johnson@healthcare.com",
			website: "www.drsarahjohnson.com",
		},
		operatingHours: {
			regular: {
				startTime: "08:00",
				endTime: "16:00",
			},
		},
		rating: 4.9,
		isVerified: true,
		status: EDoctorStatus.ONLINE,

		// Doctor Specific Properties
		platform_id: "PLAT002",
		userId: "USR002",
		firstName: "Sarah",
		lastName: "Johnson",
		// phone: [4155550123],
		specialization: ["Pediatrics", "Neonatology"],
		degree: ["MD", "FAAP"],
		experience: 12,
		registrationNumber: "MED789012",
		clinic: [
			{
				id: "CLN002",
				name: "SF Children's Clinic",
				address: [
					{
						id: "CLNADD002",
						street: "456 Healthcare Avenue",
						city: "San Francisco",
						state: "California",
						country: "USA",
						postalCode: "94105",
					},
				],
				contact: [
					{
						phone: ["+1-415-555-0123"],
						email: "clinic@sfchildren.com",
						website: "www.sfchildrensclinic.com",
					},
				],
			},
		],
		availability: [
			{
				day: [EDayOfWeek.TUESDAY, EDayOfWeek.THURSDAY],
				slots: [
					{
						startTime: "08:00",
						endTime: "16:00",
					},
				],
			},
		],
		profileImage: "https://example.com/doctors/sarah-johnson.jpg",
		consultMode: [
			EDoctorConsultMode.CLINIC,
			EDoctorConsultMode.VIDEO_CONSULT,
			EDoctorConsultMode.HOME_VISIT,
		],
	},
];
