import { ViewMaintenanceComponent } from './../view-maintenance/view-maintenance.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { MaintenanceService } from './../../shared/services/maintenance.service';
import { NewMaintenanceComponent } from './../new-maintenance/new-maintenance.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TechnicianService } from 'src/app/shared/services/technician.service';
import { MatDialog } from '@angular/material/dialog';
import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { EditMaintenanceComponent } from '../edit-maintenance/edit-maintenance.component';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { Maintanence } from 'src/app/shared/models/maintenances.model';
import { ViewMaintenancesDetailsComponent } from '../view-maintenances-details/view-maintenances-details.component';
import { ScheduleFormComponent } from '../../schedule/schedule-form/schedule-form.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LettersService } from 'src/app/shared/services/letters.service';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.scss'],
})
export class MaintenanceListComponent implements OnInit, OnDestroy {
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
    private router: Router,
    private ls: LettersService
  ) {}
  private subscription: Subscription;
  ngOnInit(): void {
    this.ms.getMaintenances();
    this.subscription = this.ms.maintenances$.subscribe((el: any[]) => {
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
    const arr: any[] = [];
    for (const service of this.export) {
      const data = {
        isRepair: service.isRepair,
        key: service.key,
        vehicleKey: service.vehicleKey.vehicleId,
        officeKey: service.officeKey.name,
        vehicleKmBefore: service.vehicleKmBefore,
        maintenanceNumber: service.maintenanceNumber,
        serviceDate: service.serviceDate.toDate()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
        maintenanceType: service.maintenanceType,
        isMaintanence: service.isMaintanence,
        created: service.created.toDate()
        .toISOString() 
        .slice(0, 19)
        .replace('T', ' '),
        technicianKey: this.ls.accentReplace( service.technicianKey.displayName),
        orderNumber: service.orderNumber,
        createdBy:this.ls.accentReplace( service.createdBy.displayName),
        status: service.status,
        typeRepair: service.typeRepair,
      };
      arr.push(data);
    }
    this.es.exportToCsv('servicios.csv', arr);
  }
  newMaintenanceDialog() {
    /*     this.dialog.open(NewMaintenanceComponent, {
      width: '400px',
    }); */
    this.router.navigate(['/new-maintenance']);
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
