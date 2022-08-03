import { VehicleService } from 'src/app/shared/services/vehicle.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditVehicleForecastComponent } from '../edit-vehicle-forecast/edit-vehicle-forecast.component';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.scss'],
})
export class ViewVehicleComponent implements OnInit {
  icons = ['', 'looks_one', 'looks_two', 'looks_3', 'looks_4', 'looks_5'];
  event = {
    title: '',
  };
  vehicle: any;
  constructor(public vs: VehicleService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.vs.vehicle$.subscribe((el) => {
      this.vehicle = el;
      console.log(this.vehicle);
    });
  }

  editForecastDialog(maintenanceNumber: number) {
    this.event.title = `Economico ${this.vehicle.vehicleId} mantenimiento #${maintenanceNumber} del proyecto ${this.vehicle.proyect.name}`;
    this.dialog.open(EditVehicleForecastComponent, {
      width: '400px',
      data: {
        event: this.event,
      },
    });
  }
}
