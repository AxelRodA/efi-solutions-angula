import { MaintenanceService } from './../../shared/services/maintenance.service';
import { Maintanence } from './../../shared/models//maintenances.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from 'src/app/shared/services/vehicle.service';
import { OfficeService } from 'src/app/shared/services/office.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import firebase from 'firebase/app';
import { TechnicianService } from 'src/app/shared/services/technician.service';

@Component({
  selector: 'app-edit-maintenance',
  templateUrl: './edit-maintenance.component.html',
  styleUrls: ['./edit-maintenance.component.scss'],
})
export class EditMaintenanceComponent implements OnInit {
  editMaintanenceForm: FormGroup;
  typeOfServices = ['Mantenimiento', 'Mantenimiento Mayor'];
  statusMaintenance = ['Programado', 'Pendiente', 'Cancelado', 'Completado'];
  constructor(
    @Inject(MAT_DIALOG_DATA) public maintenanceInfo: Maintanence,
    public os: OfficeService,
    public vs: VehicleService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private auth: AuthService,
    private ms: MaintenanceService,
    public ts: TechnicianService
  ) {}
  orderNumber = this.maintenanceInfo.orderNumber;

  ngOnInit(): void {
    console.log(this.maintenanceInfo);
    this.os.getOffices();
    this.ts.getTechnicians();

    this.editMaintanenceForm = this.fb.group({
      orderNumber: [this.maintenanceInfo.orderNumber, [Validators.required]],
      serviceDate: [
        this.maintenanceInfo.serviceDate.toDate(),
        [Validators.required],
      ],
      typeOfService: [this.maintenanceInfo.maintenanceType],
      typeRepair: [this.maintenanceInfo.typeRepair],
      office: [this.maintenanceInfo.officeKey.key, [Validators.required]],
      vehicle: [
        this.maintenanceInfo.vehicleKey.vehicleId,
        [Validators.required],
      ],
      technicianKey: [
        this.maintenanceInfo.technicianKey.uid,
        [Validators.required],
      ],
      maintenanceNumber: [this.maintenanceInfo.maintenanceNumber, []],
      service: [this.maintenanceInfo.isRepair],
      maintenance: [this.maintenanceInfo.isMaintanence],
      status: [this.maintenanceInfo.status],
    });

    this.maintanenceChange();
  }

  get typeOfService() {
    return this.editMaintanenceForm.get('typeOfService').value;
  }

  get service() {
    return this.editMaintanenceForm.get('service').value;
  }

  get maintenance() {
    return this.editMaintanenceForm.get('maintenance').value;
  }

  maintanenceChange() {
    const { service, maintenance } = this.editMaintanenceForm.value;
    if (maintenance) {
      this.editMaintanenceForm
        .get('typeOfService')
        .setValidators([Validators.required]);
      this.editMaintanenceForm.get('typeOfService').updateValueAndValidity();
      this.editMaintanenceForm.get('typeRepair').clearValidators();
      this.editMaintanenceForm.get('typeRepair').updateValueAndValidity();
    } else if (service) {
      this.editMaintanenceForm
        .get('typeRepair')
        .setValidators([Validators.required]);
      this.editMaintanenceForm.get('typeRepair').updateValueAndValidity();
      this.editMaintanenceForm.get('typeOfService').clearValidators();
      this.editMaintanenceForm.get('typeOfService').updateValueAndValidity();
    }
  }

  async editMaintenance() {
    const {
      orderNumber,
      serviceDate,
      typeOfService,
      typeRepair,
      office,
      maintenanceNumber,
      technicianKey,
      service,
      maintenance,
      vehicle,
      status,
    } = this.editMaintanenceForm.value;
    const vehicleM = await this.vs.getVehicle(this.maintenanceInfo.vehicleKey.key);
    console.log(vehicleM)
    const maintenances = vehicleM.maintenances;
    console.log(maintenances);
    const key = this.maintenanceInfo.key;
    let data = {
      key,
      orderNumber,
      serviceDate,
      isMaintanence: maintenance,
      isRepair: service,
      officeKey: office,
      maintenanceType: typeOfService,
      vehicleKey: this.maintenanceInfo.vehicleKey.key,
      technicianKey: technicianKey,
      typeRepair,
      maintenanceNumber,
      status,
    };
    //maintenances[maintenanceNumber - 1].programedDate = serviceDate;
    //maintenances[maintenanceNumber - 1].status = 'Programado';
    if (maintenanceNumber) {
      maintenances[maintenanceNumber - 1].programedDate = serviceDate;
      maintenances[maintenanceNumber - 1].status = 'Programado';
      maintenances[maintenanceNumber - 1].maintenanceKey = key;
    }

    try {
      console.log(data);
      if (maintenanceNumber) {
        await this.vs.updateVehicle(this.maintenanceInfo.vehicleKey.key, {
          maintenances: maintenances,
        });
      }
      await this.ms.updateMaintenance(key, data);
      this.openSnackBar(
        `Orden de servicio ${orderNumber} editado exitosamente`,
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
