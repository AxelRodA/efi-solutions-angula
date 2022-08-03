import { ConfigService } from './../../shared/services/config.service';
import { Maintenance, Vehicle } from './../../shared/models/vehicle.model';
import { VehicleService } from 'src/app/shared/services/vehicle.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceService } from 'src/app/shared/services/maintenance.service';

@Component({
  selector: 'app-edit-vehicle-forecast',
  templateUrl: './edit-vehicle-forecast.component.html',
  styleUrls: ['./edit-vehicle-forecast.component.scss'],
})
export class EditVehicleForecastComponent implements OnInit {
  forecastForm: FormGroup;

  statuses = ['Completado', 'Pendiente', 'Cancelado', 'Programado'];
  maintanenceNumber: number;
  configKey = 'cauRr5c6fzrPNUfKy6F8';
  maintenances: Maintenance[];
  vehicleKey: string;
  vehicle: Vehicle;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    public vs: VehicleService,
    private cs: ConfigService,
    private ms: MaintenanceService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.maintanenceNumber =
      this.data.event.title.substr(this.data.event.title.indexOf('#') + 1, 1) -
      1;
    this.vs.vehicle$.subscribe((el) => {
      let maintenance = el.maintenances[this.maintanenceNumber];
      this.maintenances = el.maintenances;
      this.vehicleKey = el.key;
      this.vehicle = el;
      this.forecastForm = this.fb.group({
        actualDate: [
          maintenance.actualDate ? maintenance.actualDate.toDate() : '',
          [Validators.required],
        ],
        forecastDate: [
          maintenance.forecastDate.toDate(),
          [Validators.required],
        ],
        programedDate: [
          maintenance.programedDate ? maintenance.programedDate.toDate() : '',
        ],
        maintenanceNumber: [maintenance.maintenanceNumber],
        serviceDoc: [maintenance.serviceDoc],
        status: [maintenance.status],
        kilometer: [maintenance.kilometer, [Validators.required]],
        serviceCost: [maintenance.serviceCost],
        extraCost: [maintenance.extraCost ? maintenance.extraCost : ''],
        comments: [maintenance.comments ? maintenance.comments : ''],
        parts: this.fb.array([]),
      });
      if (maintenance.parts) {
        for (const el of maintenance.parts) {
          const part = this.fb.group({
            name: [el.name],
            code: [el.code],
          });
          this.parts.push(part);
        }
      }
    });
  }

  get status() {
    return this.forecastForm.get('status').value;
  }

  get parts() {
    return this.forecastForm.get('parts') as FormArray;
  }

  get isDisabled() {
    if (this.forecastForm) {
      const { status, comments } = this.forecastForm.value;
      if (status == 'Completado' && this.forecastForm.valid) {
        return false;
      }
      if (status == 'Cancelado' && comments != '') {
        return false;
      }
    }
    return true;
  }
  addPart() {
    const part = this.fb.group({
      name: [],
      code: [],
    });
    this.parts.push(part);
  }

  deletePart(i: number) {
    this.parts.removeAt(i);
  }

  async updateMaintenace() {
    try {
      const currentMaintenaceNumber = this.maintanenceNumber + 1;

      this.cs.viewconfig(this.configKey);
      const {
        actualDate,
        forecastDate,
        maintenanceNumber,
        serviceDoc,
        status,
        kilometer,
        serviceCost,
        parts,
        comments,
        extraCost,
      } = this.forecastForm.value;
      if (this.maintanenceNumber > 0) {
        if (
          this.maintenances[this.maintanenceNumber - 1].kilometer > kilometer
        ) {
          alert(
            'Kilometros Incorrectos: kilometraje anterior mayor que nuevo kilometraje'
          );
          throw new Error('Incorrect Kilometer');
        }
      }

      if (this.maintenances[this.maintanenceNumber].status == 'Programado') {
        this.ms.updateMaintenance(
          this.maintenances[this.maintanenceNumber].maintenanceKey,
          { vehicleKmAfter: kilometer }
        );
      }
      const travelExpenses = await this.getTravelExpenses(kilometer);
      const data: Maintenance = {
        actualDate,
        forecastDate,
        maintenanceNumber,
        serviceDoc: serviceDoc ? serviceDoc : '',
        status,
        kilometer,
        parts: parts ? parts : [],
        travelExpenses,
        partsCost: 0,
        serviceCost: serviceCost ? serviceCost : 0,
        comments,
        extraCost,
      };
      this.maintenances[this.maintanenceNumber] = data;
      const forecast = this.vs.getForecast(
        actualDate,
        this.maintenances.length - currentMaintenaceNumber,
        currentMaintenaceNumber
      );
      for (const el of forecast) {
        this.maintenances[el.maintenanceNumber - 1] = el;
      }
      await this.vs.updateVehicle(this.vehicleKey, {
        maintenances: this.maintenances,
      });
      location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async getTravelExpenses(kilometer: number) {
    const { kilometerCost } = await this.cs.getConfig();
    const total = kilometer * kilometerCost;
    return total;
  }
}
