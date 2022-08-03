import { Timestamp } from '@firebase/firestore-types';
export interface Contact {
  key: string;
  name: string;
  role: string;
  cellphone?: string;
  lada?: string;
  phoneNumbers?: string[];
  ext?: string;
  email?: string;
  created: Timestamp;
  createdBy: string;
}
