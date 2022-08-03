import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OfficeService } from 'src/app/shared/services/office.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TechnicianService } from 'src/app/shared/services/technician.service';


@Component({
  selector: 'app-edit-office',
  templateUrl: './edit-office.component.html',
  styleUrls: ['./edit-office.component.scss']
})
export class EditOfficeComponent implements OnInit {
  editOfficeForm: FormGroup;
  regions = ['Bajio', 'Centro', 'Mexico', 'Noroeste', 'Norte', 'Sur'];

  states = [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Coahuila de Zaragoza',
    'Colima',
    'Chiapas',
    'Chihuahua',
    'Distrito Federal',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'México',
    'Michoacán de Ocampo',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz de Ignacio de la Llave',
    'Yucatán',
    'Zacatecas',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public officeInfo,
    private fb: FormBuilder,
    public os: OfficeService,
    private snackBar: MatSnackBar,
    public auth: AuthService,
    public ts : TechnicianService,
  ) { }

  ngOnInit(): void {
    this.ts.getTechnicians();
    this.editOfficeForm = this.fb.group({
      region: [this.officeInfo.region, [Validators.required]],
      name: [this.officeInfo.name, [Validators.required]],
      street: [this.officeInfo.street, [Validators.required]],
      colony: [this.officeInfo.colony],
      city: [this.officeInfo.city, [Validators.required]],
      state: [this.officeInfo.state, [Validators.required]],
      zip: [this.officeInfo.zip, [Validators.required]],
      technician: [this.officeInfo.technician ?  this.officeInfo.technician.uid:'' , [Validators.required]],
    });
  }

  async editOffice(){
    const {region, name, street, colony, city, state, zip, technician} = this.editOfficeForm.value;

    const data = {
      region,
      name,
      street,
      colony,
      city,
      state,
      zip,
      technician,
    };
    try {
      await this.os.updateOffice(this.officeInfo.key, data);
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
