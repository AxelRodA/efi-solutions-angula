import { Timestamp } from '@firebase/firestore-types';
import { Office } from './office.model';
import { User } from './user.model';
export interface Expense {
  key: string;
  expenseType: string;
  expenseDate: Timestamp;
  amount: number;
  office: string  | any;
  attachmentUrl?: string;
  destinationIni?: string;
  destinationEnd?: string;
  km?: number;
  nights?: number;
  taxiDestination?: string;
  expenseDetails?: string;
  created: Timestamp;
  createdBy: User | any;
}

export interface Deposit {
  key: string;
  depositDate: Timestamp;
  amount: number;
  attachmentUrl: string;
  technician: User| any;
  created: Timestamp;
  createdBy:  User | any;
  office: string;
}
