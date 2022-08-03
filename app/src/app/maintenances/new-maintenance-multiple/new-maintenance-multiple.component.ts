import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Maintanence } from 'src/app/shared/models/maintenances.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MaintenanceService } from 'src/app/shared/services/maintenance.service';
import { OfficeService } from 'src/app/shared/services/office.service';
import { TechnicianService } from 'src/app/shared/services/technician.service';
import { VehicleService } from 'src/app/shared/services/vehicle.service';

@Component({
  selector: 'app-new-maintenance-multiple',
  templateUrl: './new-maintenance-multiple.component.html',
  styleUrls: ['./new-maintenance-multiple.component.scss'],
})
export class NewMaintenanceMultipleComponent implements OnInit {
  newMaintanenceForm: FormGroup;
  status: boolean = true;
  typeOfServices = ['Mantenimiento', 'Mantenimiento Mayor'];
  statusMaintenance =['Programado','Pendiente', 'Cancelado','Completado']
  actualOrder: number = 0;
  totalOrders: number = 0;

  constructor(
    public os: OfficeService,
    public vs: VehicleService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private auth: AuthService,
    private ms: MaintenanceService,
    public ts: TechnicianService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.os.getOffices();
    this.ts.getTechnicians();
    this.newMaintanenceForm = this.fb.group({
      office: ['', [Validators.required]],
      serviceDate: ['', [Validators.required]],
      maintenances: this.fb.array([]),
    });
 
    this.addMaintenance();
  }

  get maintenances() {
    return this.newMaintanenceForm.get('maintenances') as FormArray;
  }

  addMaintenance() {
    const info = this.fb.group({
      orderNumber: [''],
      typeOfService: [''],
      typeRepair: [''],
      vehicle: ['', [Validators.required]],
      technicianKey: ['', [Validators.required]],
      maintenanceNumber: ['', []],
      service: [''],
      maintenance: [''],
      status:['']
    });
    this.maintenances.push(info);

    const num = this.maintenances.length - 1;
    this.maintenances.at(num).get('typeOfService').disable();
    this.maintenances.at(num).get('maintenanceNumber').disable();
    this.maintenances.at(num).get('typeRepair').disable();
  }

  maintanenceChange(i: number) {
    const { maintenances } = this.newMaintanenceForm.value;
    if (maintenances[i].maintenance) {
      this.maintenances
        .at(i)
        .get('typeOfService')
        .setValidators([Validators.required]);
      this.maintenances.at(i).get('typeOfService').updateValueAndValidity();
      this.maintenances.at(i).get('typeOfService').enable();
      this.maintenances
        .at(i)
        .get('maintenanceNumber')
        .setValidators([Validators.required]);
      this.maintenances.at(i).get('maintenanceNumber').updateValueAndValidity();
      this.maintenances.at(i).get('maintenanceNumber').enable();
    } else {
      this.maintenances.at(i).get('typeOfService').clearValidators();
      this.maintenances.at(i).get('typeOfService').updateValueAndValidity();
      this.maintenances.at(i).get('typeOfService').disable();
      this.maintenances
        .at(i)
        .get('maintenanceNumber')
        .setValidators([Validators.required]);
      this.maintenances.at(i).get('maintenanceNumber').updateValueAndValidity();
      this.maintenances.at(i).get('maintenanceNumber').disable();
    }

    if (maintenances[i].service) {
      this.maintenances
        .at(i)
        .get('typeRepair')
        .setValidators([Validators.required]);
      this.maintenances.at(i).get('typeRepair').updateValueAndValidity();
      this.maintenances.at(i).get('typeRepair').enable();
    } else {
      this.maintenances.at(i).get('typeRepair').clearValidators();
      this.maintenances.at(i).get('typeRepair').updateValueAndValidity();
      this.maintenances.at(i).get('typeRepair').disable();
    }
  }

  setOrderNumber(i) {
    const { maintenances, serviceDate } = this.newMaintanenceForm.value;
    if (serviceDate) {
      const d = new Date(serviceDate);
      const dateStamp = `${d.getDate()}${d.getMonth() + 1}${d.getFullYear()}`;
      const orderNumber = `${maintenances[i].vehicle.vehicleId}-${
        maintenances[i].maintenanceNumber
          ? maintenances[i].maintenanceNumber
          : 's'
      }-${dateStamp}`;
      this.maintenances.at(i).get('orderNumber').patchValue(orderNumber);
    } else {
      return this.openSnackBar(
        'Por favor seleciona una fecha de servicio',
        'Cerrar'
      );
    }
  }

  delete(i) {
    if (this.maintenances.length > 1) {
      this.maintenances.removeAt(i);
    }
  }

  getOrderNumber(i) {
    const { maintenances } = this.newMaintanenceForm.value;
    return maintenances[i].orderNumber ? maintenances[i].orderNumber : '';
  }



  async newMaintenance() {
    this.status = false;
    const { office, serviceDate, maintenances } = this.newMaintanenceForm.value;

    const { uid } = await this.auth.getUser();
    const created = firebase.firestore.Timestamp.fromDate(new Date(Date.now()));

    this.totalOrders = maintenances.length
    for (let i = 0; i < maintenances.length; i++) {
      const key = this.ms.createId();
      const maintenances1 = maintenances[i].vehicle.maintenances;
      let data: Maintanence = {
        key,
        orderNumber: maintenances[i].orderNumber,
        serviceDate,
        isMaintanence: maintenances[i].maintenance,
        maintenanceType: maintenances[i].typeOfService
          ? maintenances[i].typeOfService
          : '',
        isRepair: maintenances[i].service,
        typeRepair: maintenances[i].typeRepair
          ? maintenances[i].typeRepair
          : '',
        officeKey: office,
        vehicleKey: maintenances[i].vehicle.key,
        status: maintenances[i].status,
        technicianKey: maintenances[i].technicianKey,
        maintenanceNumber: maintenances[i].maintenanceNumber
          ? maintenances[i].maintenanceNumber
          : '',
        vehicleKmBefore:
          maintenances[i].maintenanceNumber > 1
            ? maintenances1[maintenances[i].maintenanceNumber - 2].kilometer
              ? maintenances1[maintenances[i].maintenanceNumber - 2].kilometer
              : ''
            : 0,
        createdBy: uid,
        created,
      };

      console.log(data);
      if (maintenances[i].maintenanceNumber) {
        maintenances1[
          maintenances[i].maintenanceNumber - 1
        ].programedDate = serviceDate;
        maintenances1[maintenances[i].maintenanceNumber - 1].status =
          'Programado';
        maintenances1[
          maintenances[i].maintenanceNumber - 1
        ].maintenanceKey = key;
      }

      try {
        if (maintenances[i].maintenanceNumber) {
          await this.vs.updateVehicle(maintenances[i].vehicle.key, {
            maintenances: maintenances1,
          });
        }
        await this.ms.createMaintenance(key, data);
        this.openSnackBar(
          `Orden de servicio ${maintenances[i].orderNumber} creado exitosamente`,
          'Cerrar'
        );
      } catch (error) {
        console.log(error);

        this.openSnackBar(error, 'Cerrar');
      }
      this.actualOrder = i+1;
    }

    this.router.navigate(['/']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
}
