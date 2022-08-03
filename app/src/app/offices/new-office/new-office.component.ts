import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfficeService } from 'src/app/shared/services/office.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Office } from 'src/app/shared/models/office.model';
import { MapsService } from 'src/app/shared/services/maps.service';
import { TechnicianService } from 'src/app/shared/services/technician.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-new-office',
  templateUrl: './new-office.component.html',
  styleUrls: ['./new-office.component.scss'],
})
export class NewOfficeComponent implements OnInit {
  newOfficeForm: FormGroup;
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
    private os: OfficeService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public auth: AuthService,
    private ms: MapsService,
    public ts : TechnicianService,
  ) {}

  ngOnInit(): void {
    this.ts.getTechnicians();
    this.newOfficeForm = this.fb.group({
      region: ['', [Validators.required]],
      name: ['', [Validators.required]],
      street: ['', [Validators.required]],
      colony: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      technician: ['', [Validators.required]],
    });
  }

  async newOffice() {
    try {
      const created = firebase.firestore.Timestamp.fromDate(
        new Date(Date.now())
      );
      const key = this.os.createId();
      const { uid } = await this.auth.getUser();
      const {
        region,
        name,
        street,
        colony,
        city,
        state,
        zip,
        technician,
      } = this.newOfficeForm.value;
      const address = `${street}, ${colony}, ${city}, ${state} ${zip}`;
      const geo = await this.ms.getGeocode(address);
      const lat = geo.results[0].geometry.location.lat;
      const lng = geo.results[0].geometry.location.lng;

      let data: Office = {
        key,
        region,
        name,
        street,
        colony,
        city,
        state,
        zip,
        address,
        lat,
        lng,
        technician,
        createdBy: uid,
        created,
      };

      await this.os.createOffice(key, data);
      return this.openSnackBar(
        '¡Se agrego exitosamente la nueva sucursal!',
        'Cerrar'
      );
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
