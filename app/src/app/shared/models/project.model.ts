import { Timestamp } from '@firebase/firestore-types';
export interface Project {
  key: string;
  name: string;
  color: string;
  created: Timestamp;
  createdBy: string;
}
