import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from 'src/app/shared/models/contact.model';
import { ContactService } from 'src/app/shared/services/contact.service';
import { NewContactComponent } from '../new-contact/new-contact.component';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { EditContactComponent } from '../edit-contact/edit-contact.component';
import { Office } from 'src/app/shared/models/office.model';
import { BulkUploadComponent } from '../../bulk-upload/bulk-upload.component';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'name',
    'role',
    'cellphone',
    'lada',
    'phoneNumbers',
    'ext',
    'email',
    'key',
  ];
  private subscription: Subscription

  constructor(
    private dialog: MatDialog,
    public cs: ContactService,
    
  ) {}

  ngOnInit(): void {}

  dataSource: MatTableDataSource<Contact>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.cs.getContacts();
    this.subscription = this.cs.contacts$.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  editContact(key: string, contact: Contact) {
    this.dialog.open(EditContactComponent, {
      width: '400px',
      data: contact,
    });
  }

  newContactDialog() {
    this.dialog.open(NewContactComponent, {
      width: '400px',
    });
  }

  bulkUploadDialog() {
    this.dialog.open(BulkUploadComponent, {
      width: '400px',
    });
  }

  deleteContacto(key: string) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cs.deleteContact(key);
      }
    });
  }
}
