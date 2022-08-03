import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contact } from 'src/app/shared/models/contact.model';
import { ContactService } from 'src/app/shared/services/contact.service';
import { OfficeService } from 'src/app/shared/services/office.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent implements OnInit {
  role = ['Gerente', 'Jefe de Mantenimiento/Encargado'];
  contactForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public contactInfo,
    
    private fb: FormBuilder,
    private cs: ContactService,
    private snackBar: MatSnackBar,
    public os: OfficeService,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    console.log(this.contactInfo)
    this.os.getOffices();
    this.contactForm = this.fb.group({
      name: [this.contactInfo.name, [Validators.required]],
      role: [this.contactInfo.role, [Validators.required]],
      cellphone: [this.contactInfo.cellphone, [Validators.required]],
      lada: [this.contactInfo.lada],
      phoneNumbers: [this.contactInfo.phoneNumbers],
      ext: [this.contactInfo.ext],
      email: [this.contactInfo.email],
      office: [this.contactInfo.office ? this.contactInfo.office.key :' ', [Validators.required]],
      
    });
   
  }

  async editContact(){
    const { name, role, cellphone, lada, phoneNumbers, ext, email, office } = this.contactForm.value;

    const data = {
      name,
      role,
      cellphone,
      lada,
      phoneNumbers,
      ext,
      email,
      office,
    };
    try {
      await this.cs.updateContact(this.contactInfo.key, data);
      
      this.openSnackBar('¡Se editó exitosamente el contacto!', 'Cerrar');
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
