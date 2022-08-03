import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { Maintanence } from './../models/maintenances.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  maintenancesCollection: AngularFirestoreCollection<Maintanence>;
  maintenances$: Observable<Maintanence[]>;
  maintenanceDoc: AngularFirestoreDocument<Maintanence>;
  maintenance$: Observable<Maintanence>;
  maintenancesSchedule$: Observable<Maintanence[]>;
  maintenancesExpired$: Observable<Maintanence[]>;

  constructor(private afs: AngularFirestore, private ef: EfisolutionsService) {}

  getMaintenances() {
    this.maintenancesCollection = this.afs.collection('maintenances', (ref) =>
      ref.orderBy('serviceDate', 'desc').orderBy('officeKey')
    );
    this.maintenances$ = this.maintenancesCollection.valueChanges().pipe(
      this.ef.docJoin({
        officeKey: 'offices',
        createdBy: 'users',
        vehicleKey: 'vehicles',
        technicianKey: 'users',
      })
    );
  }

  getMaintenancesExpired() {
    const date = new Date(Date.now());
    let day = new Date(date.setDate( date.getDate()-1))
    this.maintenancesCollection = this.afs.collection('maintenances', (ref) =>
      ref
        .where('status', 'in', ['Programado','Pendiente'])
        .where('serviceDate', '<=', day)
        .orderBy('serviceDate', 'desc').orderBy('officeKey')
    );
    this.maintenancesExpired$ = this.maintenancesCollection.valueChanges().pipe(
      this.ef.docJoin({
        officeKey: 'offices',
        createdBy: 'users',
        vehicleKey: 'vehicles',
        technicianKey: 'users',
      })
    );
  }

  getMaintenancesSchedule(
    technicianKey: string,
    officeKey: string[],
    start: Date,
    end: Date
  ) {
    this.maintenancesCollection = this.afs.collection('maintenances', (ref) =>
      ref
        .where('technicianKey', '==', technicianKey)
        .where('officeKey', 'in', officeKey)
        .where('serviceDate', '>=', start)
        .where('serviceDate', '<=', end)
        .orderBy('serviceDate')
    );
    this.maintenancesSchedule$ = this.maintenancesCollection
      .valueChanges()
      .pipe(
        this.ef.docJoin({
          officeKey: 'offices',
          createdBy: 'users',
          vehicleKey: 'vehicles',
          technicianKey: 'users',
        })
      );
  }
  createId() {
    let key = this.afs.createId();
    return key;
  }

  createMaintenance(key: string, maintenance: any) {
    return this.afs.doc(`maintenances/${key}`).set(maintenance);
  }

  viewMaintenance(key: string) {
    this.maintenanceDoc = this.afs.doc(`maintenances/${key}`);
    this.maintenance$ = this.maintenanceDoc.valueChanges().pipe(
      this.ef.docJoin({
        officeKey: 'offices',
        createdBy: 'users',
        vehicleKey: 'vehicles',
        technicianKey: 'users',
      })
    );
  }

  updateMaintenance(key: string, maintenance: any) {
    return this.afs.doc(`maintenances/${key}`).update(maintenance);
  }

  async deleteMaintenance(key: string) {
    await this.afs.doc(`maintenances/${key}`).delete();
    location.reload();
  }
}
