import { User } from './../models/user.model';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TechnicianService {
  techniciansCollection: AngularFirestoreCollection<User>;
  technicians$: Observable<User[]>;
  technicianDoc: AngularFirestoreDocument<User>;
  techinician$: Observable<User>;
  constructor(private afs: AngularFirestore) {}

  createId() {
    return this.afs.createId();
  }

  getTechnicians() {
    this.techniciansCollection = this.afs.collection('users', (ref) =>
      ref.where('role', '==', 'maintenance technician')
    );
    this.technicians$ = this.techniciansCollection.valueChanges();
  }

  createTechnician(key: string, user: any) {
    return this.afs.doc(`users/${key}`).set(user);
  }

  viewTechnician(key: string) {
    this.technicianDoc = this.afs.doc(`users/${key}`);
    this.techinician$ = this.technicianDoc.valueChanges();
  }

  updateTechnician(key: string, user: any) {
    return this.afs.doc(`users/${key}`).update(user);
  }

  deleteTechnician(key: string) {
    this.afs.doc(`users/${key}`).delete();
    location.reload();
  }
}
