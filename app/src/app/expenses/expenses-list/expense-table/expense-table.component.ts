import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { Expense } from 'src/app/shared/models/expense.model';
import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { ExpensesService } from 'src/app/shared/services/expenses.service';
import { ViewExpenseComponent } from '../../view-expense/view-expense.component';
import { User } from 'src/app/shared/models/user.model';
import { EditExpensesComponent } from '../../edit-expenses/edit-expenses.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LettersService } from 'src/app/shared/services/letters.service';

@Component({
  selector: 'app-expense-table',
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.scss'],
})
export class ExpenseTableComponent implements OnChanges {
  @Input() expenses: Expense[];
  @Input() user: User;

  dataSource: MatTableDataSource<Expense>;
  displayedColumns: string[] = [
    'createdBy',
    'expenseType',
    'expenseDate',
    'amount',
    'office',
    'expenseDetails',
    'key',
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private dialog: MatDialog,
    public es: ExpensesService,
    private ef: EfisolutionsService,
    public auth: AuthService,
    private ls: LettersService
  ) {}

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.expenses);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getdetails(expenseType: string, expense: Expense) {
    let res = '';
    switch (expenseType) {
      case 'Avion':
        res = `Inicio: ${expense.destinationIni} - Destino: ${expense.destinationEnd}`;
        break;
      case 'Bus':
        res = `Inicio: ${expense.destinationIni} - Destino: ${expense.destinationEnd}`;
        break;
      case 'Gasolina':
        res = `Kilometros: ${expense.km}`;
        break;
      case 'Hotel':
        res = `Noches: ${expense.nights}`;
        break;
      case 'Taxi':
        res = `Destino: ${expense.taxiDestination}`;
        break;
      case 'Otros':
        res = `Detalles: ${expense.expenseDetails}`;
        break;
      default:
        res = null;
        break;
    }
    return res;
  }

  viewExpense(key: string) {
    this.es.viewExpense(key);
    this.dialog.open(ViewExpenseComponent, {
      width: '350px',
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportTable() {
    const arr: any[] = [];
    for (const expense of this.expenses) {
      const data = {
        taxiDestination: expense.taxiDestination,
        destinationIni: expense.destinationIni,
        nights: expense.nights,
        created: expense.created
          .toDate()
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        office: expense.office.name,
        km: expense.km,
        expenseDate: expense.expenseDate
          .toDate()
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        expenseDetails: expense.expenseDetails,
        destinationEnd: expense.destinationEnd,
        expenseType: expense.expenseType,
        createdBy: this.ls.accentReplace(expense.createdBy.displayName),
        amount: expense.amount,
      };
      arr.push(data);
    }
    console.log(arr)

    this.ef.exportToCsv('expenses.csv', arr);
  }

  editExpenses(key: string, expenses: Expense) {

    this.dialog.open(EditExpensesComponent, {
       width: '400px',
       data : expenses,
     });
 
  
   }

  deleteExpenses(key: string) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.es.deleteExpense(key);
      }
    });
  }

}
