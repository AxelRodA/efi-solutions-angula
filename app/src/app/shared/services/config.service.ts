import { first } from 'rxjs/operators';
import { Config } from './../models/config.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  configDoc: AngularFirestoreDocument<Config>;
  config$: Observable<Config>;
  constructor(private afs: AngularFirestore) {}

  viewconfig(key: string) {
    this.configDoc = this.afs.doc(`configurations/${key}`);
    this.config$ = this.configDoc.valueChanges();
  }

  updateconfig(key: string, config: any) {
    return this.afs.doc(`configurations/${key}`).update(config);
  }

  async getConfig() {
    return await this.config$.pipe(first()).toPromise();
  }
}
