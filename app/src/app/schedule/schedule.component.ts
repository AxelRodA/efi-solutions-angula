import { AuthService } from 'src/app/shared/services/auth.service';
import { EditVehicleForecastComponent } from './../vehicles/edit-vehicle-forecast/edit-vehicle-forecast.component';
import { MatDialog } from '@angular/material/dialog';
import { Vehicle } from './../shared/models/vehicle.model';
import { VehicleService } from './../shared/services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { addDays, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { ViewVehicleComponent } from '../vehicles/view-vehicle/view-vehicle.component';
import firebase from 'firebase/app';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#2AE308',
    secondary: '#C6FDBA',
  },
  purple: {
    primary: '#6C3483',
    secondary: '#BB8FCE',
  },
};

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  events: CalendarEvent[] = [,];
  today = new Date(Date.now());
  icons = ['', 'looks_one', 'looks_two', 'looks_3', 'looks_4', 'looks_5'];
  constructor(
    public vs: VehicleService,
    private dialog: MatDialog,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.vs.getvehicles();
    this.vs.vehicles$.subscribe((el) => {
      this.getmaintenances(el);
    });
  }
  refresh: Subject<any> = new Subject();

  getmaintenances(el: Vehicle[]) {
    let maintenances: CalendarEvent[] = [];
    el.map((vehicle) => {
      let event: CalendarEvent = {
        start: vehicle.instalationDate.toDate(),
        title: ` ${vehicle.office.name}: Eco ${vehicle.vehicleId} Instalado del proyecto ${vehicle.proyect.name} `,
        color: this.getcolor('installed'),
        actions: [
          {
            label: 'ver',
            a11yLabel: 'Edit',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              console.log(vehicle);

              this.handleEvent('view', event, vehicle.key);
            },
          },
        ],
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: false,
      };
      maintenances.push(event);
      vehicle.maintenances.map((maintenance) => {
        let start = maintenance.actualDate
          ? new Date(maintenance.actualDate.toDate())
          : maintenance.programedDate
          ? new Date(maintenance.programedDate.toDate())
          : maintenance.forecastDate.toDate();
        let event: CalendarEvent = {
          start,
          title: `${vehicle.office.name}: Eco ${vehicle.vehicleId} mantenimiento #${maintenance.maintenanceNumber}`,
          color: this.getcolor(maintenance.status),
          actions: [
            {
              label: 'Editar',
              a11yLabel: 'Edit',
              onClick: ({ event }: { event: CalendarEvent }): void => {
                console.log(vehicle);
                this.handleEvent('edit', event, vehicle.key);
              },
            },
          ],
          allDay: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: false,
        };
        maintenances.push(event);
      });
    });
    this.events = maintenances;
  }

  getcolor(status: string) {
    let res: any;
    switch (status) {
      case 'Completado':
        res = colors.green;
        break;
      case 'Programado':
        res = colors.blue;
        break;
      case 'Pendiente':
        res = colors.yellow;
        break;
      case 'Cancelado':
        res = colors.red;
        break;
      case 'installed':
        res = colors.purple;
        break;
      default:
        break;
    }
    return res;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  handleEvent(action: string, event: CalendarEvent, key: string): void {
    this.vs.viewVehicle(key);
    if (action == 'view') {
      this.dialog.open(ViewVehicleComponent, {
        width: '400px',
      });
    } else if (action == 'edit'){
      this.dialog.open(EditVehicleForecastComponent, {
        width: '400px',
        data: {
          event: event,
        },
      });
    }
  }

  get monday() {
    let d = new Date(Date.now());
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return firebase.firestore.Timestamp.fromDate(new Date(d.setDate(diff)));
  }

  get sunday() {
    let d = new Date(Date.now());
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(),
      diff = d.getDate() + 7 + (day == 0 ? -6 : 0);
    return firebase.firestore.Timestamp.fromDate(new Date(d.setDate(diff)));
  }
}
