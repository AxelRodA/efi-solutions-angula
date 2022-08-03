import { TechnicianService } from './../../shared/services/technician.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NewDepositComponent } from './../new-deposit/new-deposit.component';
import { Expense, Deposit } from './../../shared/models/expense.model';
import { ExpensesService } from './../../shared/services/expenses.service';
import { NewExpenseComponent } from './../new-expense/new-expense.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/shared/models/user.model';
import {  Subscription } from 'rxjs';
import { Router } from '@angular/router';

interface Stats {
  expenses: number;
  totalSpentAmount: number;
  deposits: number;
  totalDepositAmount: number;
}
@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
})
export class ExpensesListComponent implements OnInit {
  stats: Stats = {
    expenses: 0,
    totalSpentAmount: 0,
    deposits: 0,
    totalDepositAmount: 0,
  };
  expenses$: Subscription;
  deposits$: Subscription;
  deposits: Deposit[];
  expenses: Expense[];
  user: User;
  constructor(
    private dialog: MatDialog,
    public es: ExpensesService,
    public auth: AuthService,
    public ts: TechnicianService,
    private router:Router,
  ) {}

  async ngOnInit() {
    this.ts.getTechnicians();
    await this.es.getExpenses();
    await this.es.getDeposits();
    this.user = await this.auth.getUser();
    this.getSubscriptions(null);
  }

  ngOnDestroy() {
    this.expenses$.unsubscribe();
    this.deposits$.unsubscribe();
  }

  addExpenseDialog() {
    this.dialog.open(NewExpenseComponent, {
      width: '350px',
    });
  }

  getExpenseStats(data: Expense[]) {
    if (data.length > 0) {
      const amountArr: number[] = [];
      const exptypes: string[] = [];
      for (const el of data) {
        amountArr.push(el.amount);
        exptypes.push(el.expenseType);
      }
      this.stats.totalSpentAmount = Math.round(
        amountArr.reduce((acc, cur) => acc + cur)
      );
      this.stats.expenses = data.length;
    }
  }

  getDepositStats(data: Deposit[]) {
    if (data.length > 0) {
      const amountArr: number[] = [];
      for (const el of data) {
        amountArr.push(el.amount);
      }
      this.stats.totalDepositAmount = Math.round(
        amountArr.reduce((acc, cur) => acc + cur)
      );
      this.stats.deposits = data.length;
    }
  }

  newDepositDialog() {
    this.dialog.open(NewDepositComponent, {
      width: '350px',
    });
  }

  get avaliableAmount() {
    const deposits = this.stats.totalDepositAmount
      ? this.stats.totalDepositAmount
      : 0;
    const expenses = this.stats.totalSpentAmount
      ? this.stats.totalSpentAmount
      : 0;
    return deposits - expenses ? deposits - expenses : '-';
  }

  getSubscriptions(val: string) {
    this.expenses$ = this.es.expenses$.subscribe((el) => {
      if (val) {
        el = el.filter((v) => v.createdBy.uid == val);
      }
      this.expenses = el;
      this.getExpenseStats(el);
    });
    this.deposits$ = this.es.deposits$.subscribe((el) => {
      if (val) {
        el = el.filter((v) => v.technician.uid == val);
      }
      this.deposits = el;
      this.getDepositStats(el);
    });
  }

  getTecnicianExpenses(value: User) {
   
    this.router.navigate(['/tecnichian-expenses', value.uid])
  }
}
