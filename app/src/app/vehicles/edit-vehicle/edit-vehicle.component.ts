import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from 'src/app/shared/services/vehicle.service';
import { OfficeService } from 'src/app/shared/services/office.service';


@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.scss'],
})
export class EditVehicleComponent implements OnInit {
  editVehicleForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public vehicleInfo,
    public vs: VehicleService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public os: OfficeService
  ) {}

  ngOnInit(): void {
    this.vs.getProjects();
    this.editVehicleForm = this.fb.group({
      vehicleId: [this.vehicleInfo.vehicleId, [Validators.required]],
      vin: [this.vehicleInfo.vin],
      characteristics: [this.vehicleInfo.characteristics],
      instalationDate: [this.vehicleInfo.instalationDate.toDate() ],
      proyect: [this.vehicleInfo.proyect.key],
      office: [this.vehicleInfo.office.key, [Validators.required]],
    });
    this.os.getOffices();
  }
    
  

  async editVehicle(){
    const { vehicleId, vin, characteristics, instalationDate, proyect, office } = this.editVehicleForm.value;
    const data = {
      vehicleId,
      vin,
      characteristics,
      instalationDate,
      proyect,
      office,
    };
    try {
      await this.vs.updateVehicle(this.vehicleInfo.key, data);
      console.log(data)
      this.openSnackBar('¡Se editó exitosamente!', 'Cerrar');
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