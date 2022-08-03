import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExpensesService } from 'src/app/shared/services/expenses.service';

@Component({
  selector: 'app-full-view-expenses',
  templateUrl: './full-view-expenses.component.html',
  styleUrls: ['./full-view-expenses.component.scss'],
})
export class FullViewExpensesComponent implements OnInit, OnDestroy {
  url: SafeResourceUrl;
  subscriptionParam: Subscription;
  subscriptionExp: Subscription;
  constructor(
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private es: ExpensesService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.subscriptionParam = this.route.params.subscribe((params) => {
      this.es.viewExpense(params.key);
    });
    this.subscriptionExp = this.es.expense$.subscribe((el) => {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        el.attachmentUrl
      );
    });
  }

  ngOnDestroy() {
    this.subscriptionParam.unsubscribe();
    this.subscriptionExp.unsubscribe();
  }

  backClicked() {
    this.location.back();
  }
}
