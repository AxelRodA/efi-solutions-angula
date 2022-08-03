import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { Deposit, Expense } from 'src/app/shared/models/expense.model';
import { User } from 'src/app/shared/models/user.model';
import { ExpensesService } from 'src/app/shared/services/expenses.service';
import { EditDepositComponent } from '../../edit-deposit/edit-deposit.component';
import { ViewExpenseComponent } from '../../view-expense/view-expense.component';
import { ExpenseReceiptDialogComponent } from '../expense-receipt-dialog/expense-receipt-dialog.component';

@Component({
  selector: 'app-expense-mobile-view',
  templateUrl: './expense-mobile-view.component.html',
  styleUrls: ['./expense-mobile-view.component.scss'],
})
export class ExpenseMobileViewComponent implements OnInit {
  @Input() deposits: Deposit[];
  @Input() expenses: Expense[];

  @Input() user: User;

  constructor(private dialog: MatDialog, public es: ExpensesService) {}

  ngOnInit(): void {}

  viewExpense(key: string) {
    this.es.viewExpense(key);
    this.dialog.open(ViewExpenseComponent, {
      width: '350px',
    });
  }
  getReceipt(url: string) {
    this.dialog.open(ExpenseReceiptDialogComponent, {
      width: '500px',
      height: '450px',
      data: url,
    });
  }

  editDeposit(key: string, deposit : Deposit) {

    this.dialog.open(EditDepositComponent, {
       width: '400px',
       data : deposit,
     });
 
  
   }

  deleteExpense(key: string) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.es.deleteExpense(key);
      }
    });
  }

  deleteDeposit(key: string) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.es.deleteDeposit(key);
      }
    });
  }

}
