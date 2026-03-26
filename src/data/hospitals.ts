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
}

export const hospitals: Hospital[] = [
  {
    id: "1",
    name: "City General Hospital",
    address: "123 Main Street, Downtown",
    lat: 28.6139,
    lng: 77.2090,
    type: "General",
    crowdLevel: "Low",
    waitingTime: 12,
    patientCount: 45,
    totalBeds: 200,
    availableBeds: 78,
    icuAvailable: 5,
    otAvailable: 3,
    ambulanceCount: 4,
    queueLength: 8,
    phone: "+1 555-0101",
    rating: 4.5,
    isRegistered: true,
    aiRecommended: true,
  },
  {
    id: "2",
    name: "Metro Emergency Center",
    address: "456 Health Ave, Midtown",
    lat: 28.6280,
    lng: 77.2195,
    type: "Emergency",
    crowdLevel: "High",
    waitingTime: 45,
    patientCount: 120,
    totalBeds: 150,
    availableBeds: 12,
    icuAvailable: 1,
    otAvailable: 0,
    ambulanceCount: 6,
    queueLength: 35,
    phone: "+1 555-0102",
    rating: 4.2,
    isRegistered: true,
  },
  {
    id: "3",
    name: "Sunrise Medical Hub",
    address: "789 Care Road, Eastside",
    lat: 28.6350,
    lng: 77.2250,
    type: "General",
    crowdLevel: "Medium",
    waitingTime: 25,
    patientCount: 78,
    totalBeds: 180,
    availableBeds: 42,
    icuAvailable: 3,
    otAvailable: 2,
    ambulanceCount: 3,
    queueLength: 18,
    phone: "+1 555-0103",
    rating: 4.7,
    isRegistered: true,
  },
  {
    id: "4",
    name: "Green Valley Clinic",
    address: "321 Wellness Blvd, Northend",
    lat: 28.6450,
    lng: 77.2100,
    type: "General",
    crowdLevel: "Low",
    waitingTime: 8,
    patientCount: 22,
    totalBeds: 80,
    availableBeds: 45,
    icuAvailable: 2,
    otAvailable: 1,
    ambulanceCount: 2,
    queueLength: 4,
    phone: "+1 555-0104",
    rating: 4.8,
    isRegistered: true,
  },
  {
    id: "5",
    name: "Central Trauma Institute",
    address: "555 Emergency Lane, Southgate",
    lat: 28.6000,
    lng: 77.2300,
    type: "Emergency",
    crowdLevel: "Medium",
    waitingTime: 30,
    patientCount: 95,
    totalBeds: 250,
    availableBeds: 55,
    icuAvailable: 4,
    otAvailable: 2,
    ambulanceCount: 8,
    queueLength: 22,
    phone: "+1 555-0105",
    rating: 4.4,
    isRegistered: true,
  },
  {
    id: "6",
    name: "Lakeside Community Hospital",
    address: "Near Lake Park, Westend",
    lat: 28.6200,
    lng: 77.1950,
    type: "General",
    crowdLevel: "Low",
    waitingTime: 15,
    patientCount: 35,
    totalBeds: 100,
    availableBeds: 52,
    icuAvailable: 2,
    otAvailable: 1,
    ambulanceCount: 2,
    queueLength: 6,
    phone: "+1 555-0106",
    rating: 4.3,
    isRegistered: false,
  },
];
