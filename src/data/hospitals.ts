export type CrowdLevel = "Low" | "Medium" | "High";

export interface Hospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "General" | "Emergency" | "Specialty";
  crowdLevel: CrowdLevel;
  waitingTime: number; // minutes
  patientCount: number;
  totalBeds: number;
  availableBeds: number;
  icuAvailable: number;
  otAvailable: number;
  ambulanceCount: number;
  queueLength: number;
  phone: string;
  rating: number;
  isRegistered: boolean;
  aiRecommended?: boolean;
  emergencyActive?: boolean;
}

export const hospitals: Hospital[] = [];
