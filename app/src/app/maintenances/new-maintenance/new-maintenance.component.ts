import { MaintenanceService } from './../../shared/services/maintenance.service';
import { Maintanence } from './../../shared/models//maintenances.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from 'src/app/shared/services/vehicle.service';
import { OfficeService } from 'src/app/shared/services/office.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import { TechnicianService } from 'src/app/shared/services/technician.service';

@Component({
  selector: 'app-new-maintenance',
  templateUrl: './new-maintenance.component.html',
  styleUrls: ['./new-maintenance.component.scss'],
})
export class NewMaintenanceComponent implements OnInit {
  newMaintanenceForm: FormGroup;
  typeOfServices = ['Mantenimiento', 'Mantenimiento Mayor'];
  constructor(
    public os: OfficeService,
    public vs: VehicleService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private auth: AuthService,
    private ms: MaintenanceService,
    public ts: TechnicianService
  ) {}

  ngOnInit(): void {
    this.os.getOffices();
    this.ts.getTechnicians();
    this.newMaintanenceForm = this.fb.group({
      orderNumber: ['', [Validators.required]],
      serviceDate: ['', [Validators.required]],
      typeOfService: [''],
      typeRepair: ['', [Validators.required]],
      office: ['', [Validators.required]],
      vehicle: ['', [Validators.required]],
      technicianKey: ['', [Validators.required]],
      maintenanceNumber: ['', []],
      service: [''],
      maintenance: [''],
    });
  }

  get typeOfService() {
    return this.newMaintanenceForm.get('typeOfService').value;
  }

  get service() {
    return this.newMaintanenceForm.get('service').value;
  }

  get maintenance() {
    return this.newMaintanenceForm.get('maintenance').value;
  }

  maintanenceChange() {
    const { service, maintenance } = this.newMaintanenceForm.value;
    if (maintenance) {
      this.setOrderNumber();
      this.newMaintanenceForm
        .get('typeOfService')
        .setValidators([Validators.required]);
      this.newMaintanenceForm.get('typeOfService').updateValueAndValidity();
      this.newMaintanenceForm.get('typeRepair').clearValidators();
      this.newMaintanenceForm.get('typeRepair').updateValueAndValidity();
    } else if (service){
      this.newMaintanenceForm
        .get('typeRepair')
        .setValidators([Validators.required]);
      this.newMaintanenceForm.get('typeRepair').updateValueAndValidity();
      this.newMaintanenceForm.get('typeOfService').clearValidators();
      this.newMaintanenceForm.get('typeOfService').updateValueAndValidity();
    }
  }

  setOrderNumber() {
    const {
      maintenanceNumber,
      vehicle,
      serviceDate,
    } = this.newMaintanenceForm.value;
    if (serviceDate) {
      const d = new Date(serviceDate);
      const dateStamp = `${d.getDate()}${d.getMonth() + 1}${d.getFullYear()}`;
      const orderNumber = `${vehicle.vehicleId}-${
        maintenanceNumber ? maintenanceNumber : 's'
      }-${dateStamp}`;
      this.newMaintanenceForm.patchValue({ orderNumber });
    } else {
      this.newMaintanenceForm.patchValue({ maintenanceNumber: '' });
      return this.openSnackBar(
        'Por favor seleciona una fecha de servicio',
        'Cerrar'
      );
    }
  }

  get orderNumber() {
    return this.newMaintanenceForm.get('orderNumber').value;
  }

  async newMaintenance() {
    const {
      orderNumber,
      serviceDate,
      typeOfService,
      typeRepair,
      office,
      vehicle,
      maintenanceNumber,
      technicianKey,
      service,
      maintenance,
    } = this.newMaintanenceForm.value;

    const { uid } = await this.auth.getUser();
    const created = firebase.firestore.Timestamp.fromDate(new Date(Date.now()));
    const key = this.ms.createId();
    const maintenances = vehicle.maintenances;
    console.log(
      vehicle,
      maintenances[maintenanceNumber - 2],
      maintenanceNumber
    );
    let data: Maintanence = {
      key,
      orderNumber,
      serviceDate,
      isMaintanence: maintenance,
      maintenanceType: typeOfService,
      isRepair: service,
      typeRepair,
      officeKey: office,
      vehicleKey: vehicle.key,
      technicianKey,
      maintenanceNumber,
      vehicleKmBefore:
        maintenanceNumber > 1
          ? maintenances[maintenanceNumber - 2].kilometer
          : 0,
      createdBy: uid,
      created,
    };

    console.log(data);
    if (maintenanceNumber) {
      maintenances[maintenanceNumber - 1].programedDate = serviceDate;
      maintenances[maintenanceNumber - 1].status = 'Programado';
      maintenances[maintenanceNumber - 1].maintenanceKey = key;
    }

    try {
      if (maintenanceNumber) {
        await this.vs.updateVehicle(vehicle.key, {
          maintenances: maintenances,
        });
      }
      await this.ms.createMaintenance(key, data);
      this.openSnackBar(
        `Orden de servicio ${orderNumber} creado exitosamente`,
        'Cerrar'
      );
    } catch (error) {
      this.openSnackBar(error, 'Cerrar');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
}
