import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { Deposit } from 'src/app/shared/models/expense.model';
import { User } from 'src/app/shared/models/user.model';
import { ExpensesService } from 'src/app/shared/services/expenses.service';
import { EditDepositComponent } from '../../edit-deposit/edit-deposit.component';
import { ExpenseReceiptDialogComponent } from '../expense-receipt-dialog/expense-receipt-dialog.component';

@Component({
  selector: 'app-deposit-table',
  templateUrl: './deposit-table.component.html',
  styleUrls: ['./deposit-table.component.scss'],
})
export class DepositTableComponent implements OnChanges {
  @Input() deposits: Deposit[];
  @Input() user: User;

  dataSource: MatTableDataSource<Deposit>;
  displayedColumns: string[] = [
    'createdBy',
    'technician',
    'depositDate',
    'amount',
    'attachmentUrl',
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private dialog: MatDialog, public es: ExpensesService) {}

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.deposits);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getReceipt(url: string) {
    this.dialog.open(ExpenseReceiptDialogComponent, {
      width: '500px',
      height: '450px',
      data: url,
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  editDeposit(key: string, deposit : Deposit) {

    this.dialog.open(EditDepositComponent, {
       width: '400px',
       data : deposit,
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
