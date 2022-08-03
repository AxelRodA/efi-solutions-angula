import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from 'src/app/shared/services/contact.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import firebase from 'firebase/app';
import { Contact } from 'src/app/shared/models/contact.model';
import { OfficeService } from 'src/app/shared/services/office.service';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.scss']
})
export class NewContactComponent implements OnInit {
  contactForm: FormGroup;
  role = ['Gerente', 'Jefe de Mantenimiento/Encargado'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public cs: ContactService,
    private auth: AuthService,
    public os: OfficeService
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      role: ['', [Validators.required]],
      cellphone: ['', [Validators.required]],
      lada: [''],
      phoneNumbers: [''],
      ext: [''],
      email: [''],
    
    });
    this.os.getOffices();
  }

  async newContact() {
    const created = firebase.firestore.Timestamp.fromDate(new Date(Date.now()));
    const key = this.cs.createId();
    const { uid } = await this.auth.getUser();
    const { name,role, cellphone,lada, phoneNumbers, ext, email, } = this.contactForm.value;

    const data: Contact = {
      key,
      name,
      role,
      cellphone,
      lada,
      phoneNumbers,
      ext,
      email,
      created,
      createdBy: uid,
    };
    try {
      await this.cs.createContact(key, data);
      this.openSnackBar('¡Se creo exitosamente el nuevo Contacto!', 'Cerrar');
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
