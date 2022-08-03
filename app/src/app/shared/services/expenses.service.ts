import { AuthService } from 'src/app/shared/services/auth.service';
import { Expense, Deposit } from './../models/expense.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/firestore';
import { EfisolutionsService } from './efisolutions.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  expensesCollection: AngularFirestoreCollection<Expense[]>;
  expenses$: Observable<Expense[]>;
  expenseDoc: AngularFirestoreDocument<Expense>;
  expense$: Observable<Expense>;
  depositsCollection: AngularFirestoreCollection<Deposit>;
  deposits$: Observable<Deposit[]>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private es: EfisolutionsService
  ) {}

  async getExpenses() {
    const { uid, role } = await this.auth.getUser();
    if (role == 'admin') {
      this.expensesCollection = this.afs.collection('expenses', (ref) =>
        ref.orderBy('expenseDate', 'desc')
      );
    } else {
      this.expensesCollection = this.afs.collection('expenses', (ref) =>
        ref.where('createdBy', '==', uid).orderBy('expenseDate', 'desc')
      );
    }

    this.expenses$ = this.expensesCollection
      .valueChanges()
      .pipe(this.es.docJoin({ office: 'offices', createdBy: 'users' }));
  }

  async getDeposits() {
    const { uid, role } = await this.auth.getUser();
    if (role == 'admin') {
      this.depositsCollection = this.afs.collection('deposits', (ref) =>
        ref.orderBy('depositDate', 'desc')
      );
    } else {
      this.depositsCollection = this.afs.collection('deposits', (ref) =>
        ref.where('technician', '==', uid).orderBy('depositDate', 'desc')
      );
    }
    this.deposits$ = this.depositsCollection
      .valueChanges()
      .pipe(this.es.docJoin({ technician: 'users', createdBy: 'users' }));
  }

  createId() {
    return this.afs.createId();
  }

  createExpense(key: string, expense: any) {
    return this.afs.doc(`expenses/${key}`).set(expense);
  }

  viewExpense(key: string) {
    this.expenseDoc = this.afs.doc(`expenses/${key}`);
    this.expense$ = this.expenseDoc.valueChanges();
  }

  async updateExpense(key: string, expense: any) {
    await this.afs.doc(`expenses/${key}`).update(expense);
    location.reload();
  }

  async deleteExpense(key: string) {
    await this.afs.doc(`expenses/${key}`).delete();
    location.reload();
  }
  addDeposit(key: string, deposit: Deposit) {
    return this.afs.doc(`deposits/${key}`).set(deposit);
  }

  updateDeposit(key: string, deposit: any) {
    return this.afs.doc(`deposits/${key}`).update(deposit);
  }

  async deleteDeposit(key: string) {
    console.log();
    await this.afs.doc(`deposits/${key}`).delete();
    location.reload();
  }
}
