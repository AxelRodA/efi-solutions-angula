import { OfficeService } from 'src/app/shared/services/office.service';
import { ExpensesService } from './../../shared/services/expenses.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ExpenseReceiptDialogComponent } from '../expenses-list/expense-receipt-dialog/expense-receipt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FullViewExpensesComponent } from '../full-view-expenses/full-view-expenses.component';

@Component({
  selector: 'app-view-expense',
  templateUrl: './view-expense.component.html',
  styleUrls: ['./view-expense.component.scss'],
})
export class ViewExpenseComponent implements OnInit {
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

  private subscription: Subscription;

  constructor(
    public es: ExpensesService,
    private fb: FormBuilder,
    public os: OfficeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.os.getOffices();
    this.subscription = this.es.expense$.subscribe((el) => {
      this.expenseForm = this.fb.group({
        expenseType: [el.expenseType],
        expenseDate: [el.expenseDate.toDate()],
        amount: [el.amount],
        office: [el.office],
        attachmentUrl: [el.attachmentUrl],
        expenseDetails: [el.expenseDetails],
        destinationIni: [el.destinationIni],
        destinationEnd: [el.destinationEnd],
        nights: [el.nights],
        km: [el.km],
        taxiDestination: [el.taxiDestination],
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get expenseType() {
    return this.expenseForm.get('expenseType').value;
  }

  closeDialog(){
    this.dialog.closeAll()
  }
/*   getDoc(url: string) {
    this.dialog.open(FullViewExpensesComponent, {
      data: url,
    });
  } */
}
