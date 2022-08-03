import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-expense-receipt-dialog',
  templateUrl: './expense-receipt-dialog.component.html',
  styleUrls: ['./expense-receipt-dialog.component.scss'],
})
export class ExpenseReceiptDialogComponent implements OnInit {
  url: SafeResourceUrl;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.data);
  }

  viewNewTab() {
    window.open(this.data)
  }
}
