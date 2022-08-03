import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Deposit } from './../../shared/models/expense.model';
import { TechnicianService } from 'src/app/shared/services/technician.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ExpensesService } from './../../shared/services/expenses.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { OfficeService } from './../../shared/services/office.service';

@Component({
  selector: 'app-new-deposit',
  templateUrl: './new-deposit.component.html',
  styleUrls: ['./new-deposit.component.scss'],
})
export class NewDepositComponent implements OnInit {
  depositForm: FormGroup;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadUrl;
  task: AngularFireUploadTask;
  key: string;
  fileState: boolean = false;

  constructor(
    private es: ExpensesService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public ts: TechnicianService,
    private storage: AngularFireStorage,
    public os: OfficeService,
  ) {}

  ngOnInit(): void {
    this.ts.getTechnicians();
    this.os.getOffices();
    this.depositForm = this.fb.group({
      depositDate: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      technician: ['', [Validators.required]],
      attachmentUrl: ['', [Validators.required]],
      office: ['', [Validators.required]],
    });
    this.key = this.es.createId();
  }

  async newDeposit() {
    try {
      const { uid } = await this.auth.getUser();
      const created = firebase.firestore.Timestamp.fromDate(
        new Date(Date.now())
      );
      const {
        depositDate,
        amount,
        technician,
        attachmentUrl,
        office,
      } = this.depositForm.value;
      const data: Deposit = {
        key: this.key,
        depositDate,
        amount,
        technician,
        attachmentUrl,
        office,
        createdBy: uid,
        created,
      };
      await this.es.addDeposit(this.key, data);
      this.openSnackBar('Deposito agregado exitosamente');
    } catch (error) {
      this.openSnackBar(error);
    }
  }

  uploadFile(file) {
    const path = `deposits/${this.key}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(async () => {
        const downloadUrl = await ref.getDownloadURL().toPromise();
        this.depositForm.patchValue({ attachmentUrl: downloadUrl });
        this.percentage = null;
        this.snapshot = null;
        this.fileState = true;
      })
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
    });
  }
}
