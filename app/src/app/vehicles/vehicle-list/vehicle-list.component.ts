import { NewProjectComponent } from './../new-project/new-project.component';
import { DeleteComponent } from './../../components/delete/delete.component';
import { EditVehicleComponent } from './../edit-vehicle/edit-vehicle.component';
import { ViewVehicleComponent } from './../view-vehicle/view-vehicle.component';
import { OfficeService } from 'src/app/shared/services/office.service';
import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { MatDialog } from '@angular/material/dialog';
import { VehicleService } from './../../shared/services/vehicle.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Vehicle } from './../../shared/models/vehicle.model';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NewVehicleComponent } from '../new-vehicle/new-vehicle.component';
import { Office } from 'src/app/shared/models/office.model';
import { BulkUploadComponent } from '../../bulk-upload/bulk-upload.component';
import firebase from 'firebase/app';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
})
export class VehicleListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'vehicleId',
    'vin',
    'characteristics',
    'instalationDate',
    'office',
    'proyect',
    'key',
  ];

  dataSource: MatTableDataSource<Vehicle>;
  export: Vehicle[];
  vehicles: Vehicle[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  private subscription: Subscription;
  constructor(
    public vs: VehicleService,
    private dialog: MatDialog,
    private es: EfisolutionsService,
    public os: OfficeService
  ) {}

  ngOnInit(): void {
    this.vs.getvehicles();
    this.subscription = this.vs.vehicles$.subscribe((el) => {
      let sorted = el.sort((n1, n2) => {
        if (n1.office.name > n2.office.name) {
          return 1;
        }
        if (n1.office.name < n2.office.name) {
          return -1;
        }
        return 0;
      });
      this.dataSource = new MatTableDataSource(sorted);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.vehicles = el;
      this.export = el;
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportCsv() {
    const arr = [];
    for (let vehicle of this.export) {
      const data = {
        createdBy: vehicle.createdBy.displayName,
        vehicleId: vehicle.vehicleId,
        characteristics: vehicle.characteristics,
        instalationDate: vehicle.instalationDate
          .toDate()
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        key: vehicle.key,
        office: vehicle.office.name,
        vin: vehicle.vin,
        proyect: vehicle.proyect.name,
        maintenances: JSON.stringify(vehicle.maintenances),
        created: vehicle.created
          .toDate()
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
      };
      arr.push(data);
    }
    this.es.exportToCsv('economicos.csv', arr);
  }

  async importMaintanences(event) {
    this.es.importExcel(event);
    setTimeout(async () => {
      const maintenances = this.es.import.carga;
      for (const el of maintenances) {
        const vehicleId = el.vehicleId;
        const actualDate = el.actualDate;
        const kilometer = el.kilometer;
        const name = el.name;
        const maintenanceNumber = el.maintenanceNumber;
        const status = 'Completado';
        try {
          const vehicle = this.vehicles.filter(
            (el) => el.vehicleId == vehicleId
          )[0];
          if (vehicle) {
            const maintenances = vehicle.maintenances;
            const curr = maintenances[maintenanceNumber - 1];
            curr.parts = [];

            curr.maintenanceNumber = maintenanceNumber;
            curr.kilometer = kilometer;
            curr.actualDate = firebase.firestore.Timestamp.fromDate(
              this.es.getJsDateFromExcel(actualDate)
            );
            curr.parts.push({ name: name, cost: 0 });
            curr.status = status;
            const forecast = this.vs.getForecast(
              this.es.getJsDateFromExcel(actualDate),
              5 - maintenanceNumber,
              maintenanceNumber
            );
            for (const m of forecast) {
              //  console.log(maintenances[m.maintenanceNumber - 1], m, m.maintenanceNumber,maintenances[m.maintenanceNumber - 1].maintenanceNumber);
              maintenances[m.maintenanceNumber - 1] = m;
            }
            console.log(vehicle);
            await this.vs.updateVehicle(vehicle.key, {
              maintenances: maintenances,
            });
          } else {
            console.log('no vehicle', el);
          }
        } catch (error) {
          console.log(error, el);
        }
      }
    }, 4000);
  }

  newVehicleDialog() {
    this.dialog.open(NewVehicleComponent, {
      width: '400px',
    });
  }
  newProjectDialog() {
    this.dialog.open(NewProjectComponent, {
      width: '400px',
    });
  }

  bulkUploadDialog() {
    this.dialog.open(BulkUploadComponent, {
      width: '400px',
    });
  }

  actions(action: string, vehicle: Vehicle) {
    this.vs.viewVehicle(vehicle.key);
    switch (action) {
      case 'view':
        this.dialog.open(ViewVehicleComponent, {
          width: '500px',
        });
        break;
      case 'edit':
        this.dialog.open(EditVehicleComponent, {
          data: vehicle,
          width: '400px',
        });
        break;
      case 'delete':
        let dialogRef = this.dialog.open(DeleteComponent, { width: '400px' });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.vs.deleteVehicle(vehicle.key);
          }
        });
        break;

      default:
        break;
    }
  }
}
