import { Component, OnInit } from '@angular/core';
import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';
import { MaintenanceService } from 'src/app/shared/services/maintenance.service';

@Component({
  selector: 'app-view-maintenances-details',
  templateUrl: './view-maintenances-details.component.html',
  styleUrls: ['./view-maintenances-details.component.scss']
})
export class ViewMaintenancesDetailsComponent implements OnInit {

  constructor(public ms: MaintenanceService, private es: EfisolutionsService) {}
  async ngOnInit() {
    
  }

  exportPdf(name: string) {
    const data = document.getElementById('pdf');
   this.es.downloadPDF(data,name)
  
  }

}
