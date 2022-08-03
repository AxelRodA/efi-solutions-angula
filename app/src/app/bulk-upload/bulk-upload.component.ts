import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';
import * as XLSX from 'xlsx';
import firebase from 'firebase/app';
import { VehicleService } from 'src/app/shared/services/vehicle.service';
import { ContactService } from 'src/app/shared/services/contact.service'

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {
  currentJson: any[];
  uploadCollection: string
  
  @ViewChild('upload') upload: ElementRef;
  percent: number;

  uploadType = [
    'Vehiculos',
    'Contactos',
  ] 

  constructor(
    private snackBar: MatSnackBar,
    private auth: AuthService,
    public vs: VehicleService,
    public cs: ContactService,
  ) { }

  ngOnInit(): void {
  }

  fileChange(event: any) {
    const file = event.target.files[0];
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.currentJson = jsonData.carga;
      if (!this.currentJson) {
        this.clearCurrentJson();
        return this.openSnackBar(
          'El nombre de la hoja de excel debe ser *carga*',
          'Close'
        );
      }
    };
    reader.readAsBinaryString(file);
  }

  async batchUpload() {
    try {
      const total = this.currentJson.length;
      const { uid } = await this.auth.getUser();
      const created = firebase.firestore.Timestamp.now();
      let current = 0;
      this.currentJson.map((el) => {
        let key = this.vs.createId();
        el.key = key;
        el.createdBy = uid;
        el.created = created;
      });
      for (const data of this.currentJson) {
        console.log(data);
        current++;
        if(this.uploadCollection == 'Vehiculos') {
          console.log(this.uploadCollection)
          // await this.vs.createVehicle(data.key, data);
          
        }
        if(this.uploadCollection == 'Contactos') {
          console.log(this.uploadCollection)
         // await this.cs.createContact(data.key, data);
        }
        this.percent = Math.round((current / total) * 100);
      }
      this.percent = null;
      this.clearCurrentJson();
      this.openSnackBar(
        `Se cargaron exitosamente ${total} registros`,
        'Cerrar'
      );
    } catch (error) {
      this.openSnackBar(error, 'Cerrar');
    }
  }

  clearCurrentJson() {
    this.currentJson = null;
    this.upload.nativeElement.value = '';
  }
  
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }


}
