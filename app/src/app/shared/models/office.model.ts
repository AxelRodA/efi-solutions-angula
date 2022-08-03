import { Timestamp } from '@firebase/firestore-types';

export interface Office {
    key: string;
    region: string;
    name: string;
    street: string;
    colony: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    lat: number;
    lng: number;
    technician?: any;
    createdBy: string;
    created: Timestamp;
}