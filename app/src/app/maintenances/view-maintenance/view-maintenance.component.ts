import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { MaintenanceService } from './../../shared/services/maintenance.service';
import { Component, OnInit, } from '@angular/core';

@Component({
  selector: 'app-view-maintenance',
  templateUrl: './view-maintenance.component.html',
  styleUrls: ['./view-maintenance.component.scss'],
})
export class ViewMaintenanceComponent implements OnInit {
  constructor(public ms: MaintenanceService, private es: EfisolutionsService) {}
  ngOnInit(): void {
    console.log(this.ms.maintenance$);
  }

  exportPdf(name: string) {
    const data = document.getElementById('pdf');
   this.es.downloadPDF(data,name)
  
  }
}
