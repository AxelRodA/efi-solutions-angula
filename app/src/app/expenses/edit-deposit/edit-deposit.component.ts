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
  selector: 'app-edit-deposit',
  templateUrl: './edit-deposit.component.html',
  styleUrls: ['./edit-deposit.component.scss']
})
export class EditDepositComponent implements OnInit {
  editDepositForm: FormGroup;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  fileState: boolean = false;

  task: AngularFireUploadTask;
  key: string;

  constructor(@Inject(MAT_DIALOG_DATA) public depositInfo, 
  private fb: FormBuilder,
  private snackBar: MatSnackBar,
  public os: OfficeService,
  private es: ExpensesService,
  public ts: TechnicianService,
  private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.ts.getTechnicians();
    this.os.getOffices();
    console.log(this.depositInfo)
    this.editDepositForm = this.fb.group({
      depositDate: [this.depositInfo.depositDate.toDate(), [Validators.required]],
      amount: [this.depositInfo.amount, [Validators.required]],
      technician: [this.depositInfo.technician.uid, [Validators.required]],
      attachmentUrl: [this.depositInfo.attachmentUrl, [Validators.required]],
      office: [this.depositInfo.office ? this.depositInfo.office: '', [Validators.required]],
    });
  }

  async editDeposit(){
    const {depositDate, amount, technician, attachmentUrl, office} = this.editDepositForm.value;

    const data = {
      depositDate,
      amount,
      technician,
      attachmentUrl,
      office,
      
     }
  
     try {
      await this.es.updateDeposit( this.depositInfo.key, data);
      this.openSnackBar('¡Se editó exitosamente', 'Cerrar');
    } catch (error) {
      return this.openSnackBar(error, 'Cerrar');
    }
  }

  uploadFile(file) {
    const path = `deposits/${this.depositInfo.key}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(async () => {
        const downloadUrl = await ref.getDownloadURL().toPromise();
        this.editDepositForm.patchValue({ attachmentUrl: downloadUrl });
        this.percentage = null;
        this.snapshot = null;
        this.fileState = true;
      })
    );
  }



  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

}
