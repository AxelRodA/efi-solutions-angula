import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Office } from '../models/office.model';


@Injectable({
  providedIn: 'root',
})
export class OfficeService {
  officesCollection: AngularFirestoreCollection<Office>;
  offices$: Observable<Office[]>;
  officeDoc: AngularFirestoreDocument<Office>;
  office$: Observable<Office>;

  constructor(private afs: AngularFirestore, private ef: EfisolutionsService) {}

  getOffices() {
    this.officesCollection = this.afs.collection('offices', (ref) =>
      ref.orderBy('name', 'asc')
    );
    this.offices$ = this.officesCollection.valueChanges()
    .pipe(this.ef.docJoin({ technician: 'users'}));
  
    
    
  }

  createId() {
    return this.afs.createId();
  }

  createOffice(key: string, office: any) {
    return this.afs.doc(`offices/${key}`).set(office);
  }

  viewOffice(key: string) {
    this.officeDoc = this.afs.doc(`offices/${key}`);
    this.office$ = this.officeDoc.valueChanges();
  }

  updateOffice(key: string, office: any) {
    return this.afs.doc(`offices/${key}`).update(office);
  }

  deleteOffice(key: string) {
    this.afs.doc(`offices/${key}`).delete();
    location.reload();
  }

  async getOffice(key: string) {
    let office = this.afs.doc<Office>(`offices/${key}`).valueChanges();
    return await office.pipe(first()).toPromise();
  }
}
