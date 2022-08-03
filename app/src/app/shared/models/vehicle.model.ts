import { Timestamp } from '@firebase/firestore-types';
export interface Vehicle {
  key: string;
  vehicleId: string;
  vin?: string;
  characteristics?: string;
  instalationDate?: Timestamp;
  proyect: string | any;
  office: any;
  createdBy: any;
  created: Timestamp;
  maintenances: Maintenance[];
}

export interface Maintenance {
  actualDate?: Timestamp;
  forecastDate: Timestamp;
  programedDate?: Timestamp;
  maintenanceNumber: number;
  serviceDoc?: string;
  status?: string;
  kilometer?: number;
  parts?: Part[];
  travelExpenses?: number;
  partsCost?: number;
  serviceCost?: number;
  maintenanceCost?: number;
  maintenanceKey?: string;
  comments? :string;
  extraCost? :number;
}

interface Part {
  name: string;
  code?: string;
  cost: number;
}
