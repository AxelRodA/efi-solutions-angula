import { AuthService } from './../../shared/services/auth.service';
import { Expense } from './../../shared/models/expense.model';
import { ExpensesService } from './../../shared/services/expenses.service';
import { Observable } from 'rxjs';
import { OfficeService } from './../../shared/services/office.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';
import firebase from 'firebase/app';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.component.html',
  styleUrls: ['./new-expense.component.scss'],
})
export class NewExpenseComponent implements OnInit {
  expenseForm: FormGroup;
  expenseTypes = [
    'Alimentos',
    'Avion',
    'Bus',
    'Caseta',
    'Gasolina',
    'Hotel',
    'Taxi',
    'Otros',
  ];
  taxiDestinations = [
    'A Terminal',
    'De Casa a Refacciones',
    'De Casa a Terminal',
    'De Hotel a Sucursal',
    'De Hotel a Terminal',
    'De Sucursal a Hotel',
    'De Sucursal a Terminal',
    'De Terminal a Casa',
    'De Terminal a Hotel',
    'De Terminal a Sucursal',
  ];

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadUrl;
  key: string;
  fileState: boolean = false;
  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public os: OfficeService,
    private storage: AngularFireStorage,
    private es: ExpensesService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      expenseType: ['', [Validators.required]],
      expenseDate: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      office: ['', [Validators.required]],
      attachmentUrl: ['', [Validators.required]],
      expenseDetails: [''],
      destinationIni: [''],
      destinationEnd: [''],
      nights: [''],
      km: [''],
      taxiDestination: [''],
    });
    this.os.getOffices();
    this.key = this.es.createId();
  }

  get expenseType() {
    return this.expenseForm.get('expenseType').value;
  }

  ExpenseTypeChange(v: string) {
    if (v == 'Alimentos') {
      this.expenseForm.get('attachmentUrl').clearValidators();
      this.expenseForm.patchValue({ amount: 300 });
    } else {
      this.expenseForm
        .get('attachmentUrl')
        .setValidators([Validators.required]);
    }
    if (v == 'Avion' || v == 'Bus') {
      this.expenseForm
        .get('destinationIni')
        .setValidators([Validators.required]);
      this.expenseForm
        .get('destinationEnd')
        .setValidators([Validators.required]);
    } else {
      this.expenseForm.get('destinationIni').clearValidators();
      this.expenseForm.get('destinationEnd').clearValidators();
    }
    if (v == 'Hotel') {
      this.expenseForm.get('nights').setValidators([Validators.required]);
    } else {
      this.expenseForm.get('nights').clearValidators();
    }
    if (v == 'Taxi') {
      this.expenseForm
        .get('taxiDestination')
        .setValidators([Validators.required]);
      this.expenseForm.get('attachmentUrl').clearValidators();
    } else {
      this.expenseForm.get('taxiDestination').clearValidators();
    }
    if (v == 'Otros') {
      this.expenseForm
        .get('expenseDetails')
        .setValidators([Validators.required]);
    } else {
      this.expenseForm.get('expenseDetails').clearValidators();
    }
    this.expenseForm.get('attachmentUrl').updateValueAndValidity();
  }

  async uploadFile(file) {
    const now = new Date(Date.now())
    const {displayName} = await this.auth.getUser()
    const path = `expenses/${displayName}/${now.getFullYear()}/${now.getMonth() +1}/${now.getDate()}${this.key}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(async () => {
        const downloadUrl = await ref.getDownloadURL().toPromise();
        this.expenseForm.patchValue({ attachmentUrl: downloadUrl });
        this.percentage = null;
        this.snapshot = null;
        this.fileState = true;
      })
    );
  }

  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferrred < snapshot.totalBytes
    );
  }

  async addExpense() {
    try {
      const created = firebase.firestore.Timestamp.fromDate(
        new Date(Date.now())
      );
      const { uid } = await this.auth.getUser();
      const {
        expenseType,
        expenseDate,
        amount,
        office,
        attachmentUrl,
        expenseDetails,
        destinationIni,
        destinationEnd,
        km,
        nights,
        taxiDestination,
      } = this.expenseForm.value;

      const data: Expense = {
        key: this.key,
        expenseType,
        expenseDate,
        amount,
        office,
        attachmentUrl: attachmentUrl ? attachmentUrl : '',
        expenseDetails: expenseDetails ? expenseDetails : '',
        destinationIni: destinationIni ? destinationIni : '',
        destinationEnd: destinationEnd ? destinationEnd : '',
        km: km ? km : '',
        nights: nights ? nights : '',
        taxiDestination: taxiDestination ? taxiDestination : '',
        created,
        createdBy: uid,
      };
      this.es.createExpense(this.key, data);
      this.openSnackBar('Gasto agregado exitosamente');
    } catch (error) {
      this.openSnackBar(error);
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
    });
  }
}
