import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { ScheduleFormComponent } from 'src/app/schedule/schedule-form/schedule-form.component';
import { Maintanence } from 'src/app/shared/models/maintenances.model';
import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { MaintenanceService } from 'src/app/shared/services/maintenance.service';
import { VehicleService } from 'src/app/shared/services/vehicle.service';
import { EditMaintenanceComponent } from '../edit-maintenance/edit-maintenance.component';
import { NewMaintenanceComponent } from '../new-maintenance/new-maintenance.component';
import { ViewMaintenancesDetailsComponent } from '../view-maintenances-details/view-maintenances-details.component';

@Component({
  selector: 'app-expired-maintenances',
  templateUrl: './expired-maintenances.component.html',
  styleUrls: ['./expired-maintenances.component.scss'],
})
export class ExpiredMaintenancesComponent implements OnInit {
  displayedColumns = [
    'serviceDate',
    'vehicleKey',
    'orderNumber',
    'isMaintanence',
    'maintenanceNumber',
    'isRepair',
    'officeKey',
    'vehicleKmBefore',
    'technicianKey',
    'key',
  ];
  dataSource: MatTableDataSource<any>;
  export: any[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private dialog: MatDialog,
    private es: EfisolutionsService,
    private ms: MaintenanceService,
    private vs: VehicleService
  ) {}
  private subscription: Subscription;
  ngOnInit(): void {
    this.ms.getMaintenancesExpired();
    this.subscription = this.ms.maintenancesExpired$.subscribe((el: any[]) => {
      
      this.dataSource = new MatTableDataSource(el);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.export = el;
      console.log(el);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportCsv() {
    this.es.exportToCsv('servicios.csv', this.export);
  }
  newMaintenanceDialog() {
    this.dialog.open(NewMaintenanceComponent, {
      width: '400px',
    });
  }

  actions(action: string, key: string, maintanence: Maintanence) {
    this.ms.viewMaintenance(key);
    switch (action) {
      case 'view':
        this.dialog.open(ViewMaintenancesDetailsComponent, {
          width: '800px',
        });
        break;
      case 'edit':
        this.dialog.open(EditMaintenanceComponent, {
          width: '400px',
          data: maintanence,
        });
        break;

      default:
        break;
    }
  }

  deleteMaintenance(key: string) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ms.deleteMaintenance(key);
      }
    });
  }
  newScheduletDialog() {
    this.dialog.open(ScheduleFormComponent, {
      width: '400px',
    });
  }
}
