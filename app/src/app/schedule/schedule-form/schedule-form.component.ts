import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TechnicianService } from 'src/app/shared/services/technician.service';
import { VehicleService } from 'src/app/shared/services/vehicle.service';
import { OfficeService } from 'src/app/shared/services/office.service';
import { MatDialog } from '@angular/material/dialog';
import { RequestScheduleComponent } from '../request-schedule/request-schedule.component';
import { MaintenanceService } from 'src/app/shared/services/maintenance.service';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss'],
})
export class ScheduleFormComponent implements OnInit {
  scheduleForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public ts: TechnicianService,
    public vs: VehicleService,
    public os: OfficeService,
    private dialog: MatDialog,
    private ms: MaintenanceService
  ) {}

  ngOnInit(): void {
    this.ts.getTechnicians();
    this.vs.getvehicles();
    this.os.getOffices();
    this.scheduleForm = this.fb.group({
      technicianKey: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      office: ['', [Validators.required]],
    });
  }

  async newSchedule() {
    const { technicianKey, start, end, office } = this.scheduleForm.value;
    const offices = [];
    office.map(el => {
      offices.push(el.key)
    })
    
    this.ms.getMaintenancesSchedule(technicianKey.uid, offices, start, end);
    
    this.dialog.open(RequestScheduleComponent, {
      width: '600px',
      maxHeight: '800px',
      data: { technician: technicianKey.displayName, start, end,offices },
    });
  }
}
