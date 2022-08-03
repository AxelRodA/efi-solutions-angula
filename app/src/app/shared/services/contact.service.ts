import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { Contact } from './../models/contact.model';
import { Observable, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactsCollection: AngularFirestoreCollection<Contact>;
  contacts$: Observable<Contact[]>;
  contactDoc: AngularFirestoreDocument<Contact>;
  contact$: Observable<Contact>;

  constructor(private afs: AngularFirestore, private es: EfisolutionsService) { }

  getContacts() {
    this.contactsCollection =  this.afs.collection('contacts');
    this.contacts$ = this.contactsCollection.valueChanges();
  }

  createId() {
    let key = this.afs.createId();
    return key;
  }

  createContact(key: string, contact: any) {
    return this.afs.doc(`contacts/${key}`).set(contact);
  }

  viewContact(key: string) {
    this.contactDoc = this.afs.doc(`contacts/${key}`);
    this.contact$ = this.contactDoc.valueChanges();
  }

  updateContact(key: string, contact: any) {
    return this.afs.doc(`contacts/${key}`).update(contact);
    
    
  }

  deleteContact(key: string) {
    this.afs.doc(`contacts/${key}`).delete();
    location.reload();
  }

}
