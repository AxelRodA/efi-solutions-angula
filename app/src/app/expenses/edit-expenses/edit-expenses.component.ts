import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpensesService } from 'src/app/shared/services/expenses.service';
import { OfficeService } from 'src/app/shared/services/office.service';
import { TechnicianService } from 'src/app/shared/services/technician.service';
import { Observable } from 'rxjs';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-expenses',
  templateUrl: './edit-expenses.component.html',
  styleUrls: ['./edit-expenses.component.scss']
})
export class EditExpensesComponent implements OnInit {
  editExpensesForm: FormGroup;
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
    @Inject(MAT_DIALOG_DATA) public expensesInfo, 
  private fb: FormBuilder,
  private snackBar: MatSnackBar,
  public os: OfficeService,
  private es: ExpensesService,
  public ts: TechnicianService,
  private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {

    console.log(this.expensesInfo)
    this.editExpensesForm = this.fb.group({
      expenseType: [this.expensesInfo.expenseType, [Validators.required]],
      expenseDate: [this.expensesInfo.expenseDate.toDate(), [Validators.required]],
      amount: [this.expensesInfo.amount, [Validators.required]],
      office: [this.expensesInfo.office.key, [Validators.required]],
      attachmentUrl: [this.expensesInfo.attachmentUrl, [Validators.required]],
      expenseDetails: [this.expensesInfo.expenseDetails],
      destinationIni: [this.expensesInfo.destinationIni],
      destinationEnd: [this.expensesInfo.destinationEnd],
      nights: [this.expensesInfo.nights],
      km: [this.expensesInfo.km],
      taxiDestination: [this.expensesInfo.taxiDestination],
    });
    this.os.getOffices();
  
  }

  get expenseType() {
    return this.editExpensesForm.get('expenseType').value;
  }

  ExpenseTypeChange(v: string) {
    if (v == 'Alimentos') {
      this.editExpensesForm.get('attachmentUrl').clearValidators();
      this.editExpensesForm.patchValue({ amount: 300 });
    } else {
      this.editExpensesForm
        .get('attachmentUrl')
        .setValidators([Validators.required]);
    }
    if (v == 'Avion' || v == 'Bus') {
      this.editExpensesForm
        .get('destinationIni')
        .setValidators([Validators.required]);
      this.editExpensesForm
        .get('destinationEnd')
        .setValidators([Validators.required]);
    } else {
      this.editExpensesForm.get('destinationIni').clearValidators();
      this.editExpensesForm.get('destinationEnd').clearValidators();
    }
    if (v == 'Hotel') {
      this.editExpensesForm.get('nights').setValidators([Validators.required]);
    } else {
      this.editExpensesForm.get('nights').clearValidators();
    }
    if (v == 'Taxi') {
      this.editExpensesForm
        .get('taxiDestination')
        .setValidators([Validators.required]);
      this.editExpensesForm.get('attachmentUrl').clearValidators();
    } else {
      this.editExpensesForm.get('taxiDestination').clearValidators();
    }
    if (v == 'Otros') {
      this.editExpensesForm
        .get('expenseDetails')
        .setValidators([Validators.required]);
    } else {
      this.editExpensesForm.get('expenseDetails').clearValidators();
    }
    this.editExpensesForm.get('attachmentUrl').updateValueAndValidity();
  }

  async uploadFile(file) {
    const path = `expenses/${this.expensesInfo.key}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(async () => {
        const downloadUrl = await ref.getDownloadURL().toPromise();
        this.editExpensesForm.patchValue({ attachmentUrl: downloadUrl });
        this.percentage = null;
        this.snapshot = null;
        this.fileState = true;
      })
    );
  }

  async editExpenses(){
    const {expenseType, expenseDate, amount, office,attachmentUrl
      ,expenseDetails,destinationIni,destinationEnd,nights,km,taxiDestination } = this.editExpensesForm.value;

    const data = {
      expenseType,
      expenseDate,
      amount,
      office,
      attachmentUrl,
      expenseDetails,
      destinationIni,
      destinationEnd,
      nights,
      km,
      taxiDestination,
      
     }
  
     try {
      await this.es.updateExpense( this.expensesInfo.key, data);
      this.openSnackBar('¡Se editó exitosamente', 'Cerrar');
    } catch (error) {
      return this.openSnackBar(error, 'Cerrar');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
}
