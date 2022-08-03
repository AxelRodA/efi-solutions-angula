import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TechnicianService } from 'src/app/shared/services/technician.service';
import { User } from 'src/app/shared/models/user.model';
import { LettersService } from 'src/app/shared/services/letters.service';

@Component({
  selector: 'app-technician-list',
  templateUrl: './technician-list.component.html',
  styleUrls: ['./technician-list.component.scss'],
})
export class TechnicianListComponent implements OnInit {
  displayedColumns = ['photoURL', 'displayName', 'email', 'role'];

  displayedName = ['Imagen', 'Nombre Completo', 'Correo', 'Role'];
  dataSource: MatTableDataSource<User>;
  export: User[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    public ts: TechnicianService,
    private dialog: MatDialog,
    private es: EfisolutionsService,
    private ls: LettersService
  ) {}

  ngOnInit(): void {
    this.ts.getTechnicians();
    this.ts.technicians$.subscribe((el) => {
      this.dataSource = new MatTableDataSource(el);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.export = el;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportCsv() {
    console.log(this.export);
    const arr: any[] = [];
    for (const technician of this.export) {
      const data = {
        userId :technician.uid,
        email: technician.email,
        displayName: this.ls.accentReplace(technician.displayName),
        role:technician.role

      };
      arr.push(data)
    }
    this.es.exportToCsv('Tecnicos.csv', arr);
  }
}
