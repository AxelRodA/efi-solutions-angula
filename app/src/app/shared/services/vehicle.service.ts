import { Maintenance, Vehicle } from './../models/vehicle.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { addDays } from 'date-fns';
import { Project } from '../models/project.model';
import { EfisolutionsService } from './efisolutions.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  vehiclesCollection: AngularFirestoreCollection<Vehicle>;
  vehicles$: Observable<Vehicle[]>;
  vehicleDoc: AngularFirestoreDocument<Vehicle>;
  vehicle$: Observable<Vehicle>;
  vehiclesByOffice$: Observable<Vehicle[]>;
  projects$: Observable<Project[]>;
  constructor(private afs: AngularFirestore, private ef: EfisolutionsService) {}

  getvehicles() {
    this.vehiclesCollection = this.afs.collection('vehicles'
  );
    this.vehicles$ = this.vehiclesCollection.valueChanges().pipe(
      this.ef.docJoin({
        office: 'offices',
        proyect: 'projects',
        createdBy: 'users',
      })
    );
  }

  getProjects() {
    const collection: AngularFirestoreCollection<Project> = this.afs.collection(
      'projects'
    );
    this.projects$ = collection.valueChanges();
  }
  createId() {
    return this.afs.createId();
  }

  createVehicle(key: string, vehicle: any) {
    return this.afs.doc(`vehicles/${key}`).set(vehicle);
  }

  viewVehicle(key: string) {
    this.vehicleDoc = this.afs.doc(`vehicles/${key}`);
    this.vehicle$ = this.vehicleDoc.valueChanges().pipe(
      this.ef.docJoin({
        office: 'offices',
        proyect: 'projects',
        createdBy: 'users',
      })
    )
  }

  getVehicle(key: string) {
    this.vehicleDoc = this.afs.doc(`vehicles/${key}`);
    return this.vehicleDoc.valueChanges().pipe(
     first()
    ).toPromise()
   
  }

  async updateVehicle(key: string, vehicle: any) {
    await this.afs.doc(`vehicles/${key}`).update(vehicle);
    console.log(key);
  }

  deleteVehicle(key: string) {
    this.afs.doc(`vehicles/${key}`).delete();
    location.reload();
  }

  getForecast(start: Date, quantiy: number, startNumber: number) {
    let now = addDays(start, 90);
    let res: Maintenance[] = [];
    for (let i = 0; i < quantiy; i++) {
      let forecast: Maintenance = {
        forecastDate: firebase.firestore.Timestamp.fromDate(now),
        maintenanceNumber: startNumber + 1,
        status: 'Pendiente',
      };
      res.push(forecast);
      startNumber += 1;
      now = addDays(now, 90);
    }
    return res;
  }

  getVehiclesByOffice(officeKey: string) {
    let collection: AngularFirestoreCollection<Vehicle> = this.afs.collection(
      'vehicles',
      (ref) => ref.where('office', '==', officeKey).orderBy('vehicleId', 'asc')
    );
    this.vehiclesByOffice$ = collection.valueChanges();
  }
}
