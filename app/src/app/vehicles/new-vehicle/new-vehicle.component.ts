import { OfficeService } from 'src/app/shared/services/office.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from 'src/app/shared/services/vehicle.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Vehicle } from 'src/app/shared/models/vehicle.model';
import firebase from 'firebase/app';

@Component({
  selector: 'app-new-vehicle',
  templateUrl: './new-vehicle.component.html',
  styleUrls: ['./new-vehicle.component.scss'],
})
export class NewVehicleComponent implements OnInit {
  newVehicleForm: FormGroup;
  constructor(
    public vs: VehicleService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private auth: AuthService,
    public os: OfficeService
  ) {}

  ngOnInit(): void {
    this.vs.getProjects();
    this.newVehicleForm = this.fb.group({
      id: ['', [Validators.required]],
      vin: [''],
      characteristics: [''],
      instalationDate: [''],
      proyect: [''],
      office: ['', [Validators.required]],
    });
    this.os.getOffices();
  }

  async newVehicle() {
    try {
      const created = firebase.firestore.Timestamp.fromDate(
        new Date(Date.now())
      );
      const key = this.vs.createId();
      const {
        id,
        vin,
        characteristics,
        instalationDate,
        proyect,
        office,
      } = this.newVehicleForm.value;
      const { uid } = await this.auth.getUser();
      let data: Vehicle = {
        key,
        vehicleId: id,
        vin: vin ? vin : '',
        characteristics: characteristics ? characteristics : '',
        instalationDate: instalationDate ? instalationDate : '',
        proyect: proyect ? proyect : '',
        office: office.key,
        createdBy: uid,
        created,
        maintenances: this.vs.getForecast(instalationDate, 5, 0),
      };
      try {
        await this.vs.createVehicle(key, data);
        return this.openSnackBar(
          '¡Se agrego exitosamente un nuevo economico!',
          'Cerrar'
        );
      } catch (error) {
        this.openSnackBar(error, 'Cerrar');
      }
    } catch (error) {
      return this.openSnackBar(error, 'Cerrar');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
}
