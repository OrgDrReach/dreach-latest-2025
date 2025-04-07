export interface Hospital {
  id: string;
  name: string;
  address: Address[];
  contact: ContactInfo;
  facilities: Facility[];
  departments: Department[];
  accreditation?: string[];
  operatingHours: OperatingHours;
  emergencyServices: boolean;
  capacity?: HospitalCapacity;
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface ContactInfo {
  phone: string[];
  email: string;
  website?: string;
  emergencyContact: string;
}

interface Facility {
  id: string;
  name: string;
  isAvailable: boolean;
  description?: string;
}

interface Department {
  id: string;
  name: string;
  head: string;
  contactExtension?: string;
}

interface OperatingHours {
  regular: {
    open: string;
    close: string;
  };
  weekends?: {
    open: string;
    close: string;
  };
  holidays?: {
    open: string;
    close: string;
  };
}

interface HospitalCapacity {
  totalBeds: number;
  availableBeds: number;
  icuBeds: {
    total: number;
    available: number;
  };
  ventilators?: {
    total: number;
    available: number;
  };
}
