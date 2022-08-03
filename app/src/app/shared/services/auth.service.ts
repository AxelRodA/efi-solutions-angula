import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;
  techincians$: Observable<User[]>;
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async signIn(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      return this.router.navigate(['/']);
    } catch (error) {
      return this.openSnackBar(error, 'Cerrar');
    }
  }

  async signOut() {
    try {
      await this.afAuth.signOut();
      return this.router.navigate(['/signin']);
    } catch (error) {
      return this.openSnackBar(error, 'Cerrar');
    }
  }

  async getUser() {
    return await this.user$.pipe(first()).toPromise();
  }

  async getOtherUser(uid: string) {
    let user = this.afs.doc<User>(`users/${uid}`).valueChanges();
    return await user.pipe(first()).toPromise();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
}
