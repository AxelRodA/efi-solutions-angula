import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { ImportComponent } from 'src/app/components/import/import.component';
import { Office } from 'src/app/shared/models/office.model';
import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { LettersService } from 'src/app/shared/services/letters.service';
import { OfficeService } from 'src/app/shared/services/office.service';
import { EditOfficeComponent } from '../edit-office/edit-office.component';
import { NewOfficeComponent } from '../new-office/new-office.component';

@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.scss'],
})
export class OfficeListComponent implements AfterViewInit {
  displayedColumns = [
    'region',
    'name',
    'street',
    'colony',
    'city',
    'state',
    'zip',
    'technician',
    'key',
  ];
  displayedName = [
    'Region',
    'Nombre',
    'Calle',
    'Colonia',
    'Ciudad',
    'Estado',
    'Codigo Postal',
    'Tecnico',
    'Acciones',
  ];
  dataSource: MatTableDataSource<Office>;
  totalOffices: number;
  officesByState: any;
  export: Office[];
  private subscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public os: OfficeService,
    private dialog: MatDialog,
    private es: EfisolutionsService,
    private ls:LettersService
  ) {}

  ngAfterViewInit() {
    this.os.getOffices();
    this.subscription = this.os.offices$.subscribe((el: Office[]) => {
      this.dataSource = new MatTableDataSource(el);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.export = el;
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
    const arr = [];
    for (let office of this.export) {
      const data = {
        lng: office.lng,
        street:this.ls.accentReplace( office.street),
        technician:office.technician ? this.ls.accentReplace(office.technician.displayName):'',
        zip: office.zip,
        city: this.ls.accentReplace(office.city),
        address:this.ls.accentReplace( office.address),
        region: office.region,
        state:this.ls.accentReplace( office.state),
        created: office.created.toDate()
        .toISOString() 
        .slice(0, 19)
        .replace('T', ' '),
        key: office.key,
        lat: office.lat,
        colony: this.ls.accentReplace(office.colony),
        name:this.ls.accentReplace( office.name),
        createdBy: office.createdBy,
      };
      arr.push(data);
    }
    this.es.exportToCsv('Oficinas.csv', arr);
  }

  importOffices(event) {
    let upload = this.es.importExcel(event);
    let dialogRef = this.dialog.open(ImportComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  newOfficeDialog() {
    this.dialog.open(NewOfficeComponent, {
      width: '600px',
    });
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  editOffice(key: string, office: Office) {
    this.dialog.open(EditOfficeComponent, {
      width: '600px',
      data: office,
    });
  }

  deleteOffice(key: string) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.os.deleteOffice(key);
      }
    });
  }
}
