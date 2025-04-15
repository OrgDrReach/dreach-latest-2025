# Dr. Reach - Healthcare Platform Technical Specifications

Version 1.1 | April 13, 2025

## 1. Introduction

### 1.1 Purpose

Dr. Reach is a comprehensive healthcare appointment management system designed to streamline the connection between patients and healthcare providers. This document outlines the technical requirements, functional specifications, and architectural design for the Dr. Reach platform.

### 1.2 Project Scope

The system encompasses appointment scheduling, patient management, doctor profiles, online consultations, and administrative functionalities, serving as a unified platform for healthcare service delivery.

### 1.3 Target Users

- Patients seeking medical consultations
- Healthcare providers (doctors, specialists)
- Hospital administrators
- Laboratory service providers
- Pharmaceutical service providers
- Ambulance service operators

## System Architecture

### Frontend (Next.js)

- Framework: Next.js 14+ with App Router
- Language: TypeScript
- State Management: Zustand
- UI Components: Shadcn/ui
- Styling: Tailwind CSS
- Form Management: React Hook Form + Zod
- Authentication: NextAuth.js

### Backend (NestJS)

- Framework: NestJS
- Database: Prisma ORM
- Authentication: JWT + Session-based
- File Storage: Multer
- Configuration: ConfigModule

## API Endpoints

### Authentication Routes (/auth)

- POST /auth/login - User login
- POST /auth/verify - OTP verification
- POST /auth/refresh - Refresh token

### User Routes (/user)

- POST /user/signup - User registration
- POST /user/updateUser - Update user profile
- POST /user/applyForServiceProvider - Provider application
- GET /user/doctors - List all doctors
- GET /user/getApprovedServiceProviders - List approved providers
- GET /user/findServiceProvidersByHomeVisit - Find home visit providers
- GET /user/findServiceProvidersList - Get all providers
- GET /user/findDoctorbyVideoConsultation - Find teleconsultation doctors
- GET /user/getServiceProvider/:username - Get provider details
- GET /user/getAppointments/:userId - Get user appointments
- POST /user/addReview - Add provider review
- GET /user/getPopularDoctors - List popular doctors

### Provider Routes (/provider)

- POST /provider/updateServiceProvider - Update provider profile
- POST /provider/updateSchedule - Update availability
- POST /provider/uploadProviderProfile - Upload profile documents
- POST /provider/checkProviderAvailability - Check availability
- POST /provider/integreatedCheckProviderAvailability - Check integrated care availability
- POST /provider/bookAppointment - Book appointment
- POST /provider/integratedBookAppointment - Book integrated care
- POST /provider/actionOnPatients - Manage patient actions
- POST /provider/addMedicalRecord - Add medical records
- POST /provider/addDocument - Upload documents
- POST /provider/removeDocument - Remove documents
- GET /provider/getProviderById/:providerId - Get provider details
- GET /provider/getSchedule/:userId - Get provider schedule
- GET /provider/getServiceProvider - Get provider profile
- GET /provider/getScheduleByHomeCare - Get home care schedule
- GET /provider/getPatients/:providerId - Get provider's patients
- GET /provider/getPatientMedicalByProvider - Get patient records
- GET /provider/getPatientsMedicalBySelf - Get self medical records
- GET /provider/getPatientsInfo - Get patient information

### Admin Routes (/admin)

- GET /admin/getAllUsers - List all users
- GET /admin/getUnverifiedProvider - List pending verifications
- GET /admin/getAppointments - List all appointments
- POST /admin/actionOnProvider - Approve/reject providers

## Development Setup

### Environment Variables

- NEXTAUTH_URL: Frontend URL
- NEXTAUTH_SECRET: Auth secret key
- GOOGLE_CLIENT_ID: Google OAuth client ID
- GOOGLE_CLIENT_SECRET: Google OAuth secret
- BACKEND_URL: NestJS backend URL
- DATABASE_URL: Database connection string

### Backend Server

- Development Port: 4000
- Production URL: <https://api.drreach.com>
- Environment: Node.js 22.14.0

## Security Requirements

1. Authentication & Authorization

   - JWT token-based authentication
   - Role-based access control (RBAC)
   - Session management
   - OAuth 2.0 integration

2. Data Protection

   - HIPAA compliance measures
   - End-to-end encryption for sensitive data
   - Secure file storage
   - Data backup and recovery

3. API Security
   - Rate limiting
   - CORS configuration
   - Input validation
   - Request sanitization

## Frontend Features

1. User Dashboard

   - Role-based views (Patient/Doctor/Hospital/Admin)
   - Appointment management
   - Medical records access
   - Profile management

2. Appointment System

   - Multi-mode booking (Video/In-person/Home visit)
   - Real-time availability
   - Integrated care coordination
   - Payment integration

3. Provider Management
   - Document verification
   - Schedule management
   - Patient records management
   - Service configuration

## Data Models

1. User

   - Basic profile
   - Authentication details
   - Role information
   - Medical history

2. Provider

   - Professional details
   - Verification documents
   - Service configuration
   - Availability schedule

3. Appointment

   - Booking details
   - Service type
   - Status tracking
   - Payment information

4. Medical Record
   - Patient information
   - Treatment details
   - Documents
   - Provider notes

## Testing Requirements

1. Frontend

   - Unit tests with Jest
   - Integration tests
   - E2E tests with Cypress

2. Backend
   - Unit tests with Jest
   - API tests
   - Integration tests

## Deployment

1. Frontend

   - Vercel deployment
   - CDN integration
   - Asset optimization

2. Backend
   - Docker containerization
   - CI/CD pipeline
   - Monitoring setup

## Performance Metrics

1. Response Times

   - API response < 200ms
   - Page load < 3s
   - First contentful paint < 1.5s

2. Availability
   - 99.9% uptime
   - Automated failover
   - Load balancing

## Monitoring

1. Application Monitoring

   - Error tracking
   - Performance metrics
   - User analytics

2. Server Monitoring
   - Resource utilization
   - Network metrics
   - Security alerts

This document serves as the primary reference for development teams, stakeholders, and project managers involved in the Dr. Reach platform. Regular updates will be made to reflect changes in requirements and technological advancements.
