import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MaintenanceService } from './../../shared/services/maintenance.service';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
})
export class ScheduleListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'serviceDate',
    'officeKey',
    'vehicleKey',
    'isMaintanence',
    'isRepair',
  ];

  constructor(private ms: MaintenanceService, private dialog: MatDialog) {}
  private subscription :Subscription

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngOnInit(): void  {
    this.subscription =this.ms.maintenancesSchedule$.subscribe((el: any[]) => {
      this.dataSource = new MatTableDataSource(el);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      console.log(el);
    });
  }


}
