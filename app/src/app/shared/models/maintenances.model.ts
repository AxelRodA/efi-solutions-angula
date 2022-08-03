import { Timestamp } from '@firebase/firestore-types';
import { Office } from './office.model';

import { User } from './user.model';
import { Vehicle } from './vehicle.model';
export interface Maintanence {
  key: string;
  orderNumber: string;
  serviceDate: Timestamp;
  isMaintanence: boolean;
  isRepair: boolean;
  typeRepair: string;
  maintenanceType: string;
  officeKey: Office;
  vehicleKey: Vehicle;
  technicianKey: User;
  maintenanceNumber: number;
  vehicleKmBefore?: string;
  vehicleKmAfter?: string;
  serviceDetails?: string;
  materials?: Materials[];
  status?: string;
  createdBy: string;
  created: Timestamp;
  
  
}

export interface Materials {
  quantity: number;
  serialNumber: string;
  description: string;
}
