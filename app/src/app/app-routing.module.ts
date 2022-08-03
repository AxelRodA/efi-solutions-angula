import { AuthGuard } from './shared/guards/auth.guard';
import { ExpensesListComponent } from './expenses/expenses-list/expenses-list.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { TechnicianListComponent } from './technicians/technician-list/technician-list.component';
import { MaintenanceListComponent } from './maintenances/maintenance-list/maintenance-list.component';
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  redirectUnauthorizedTo,
  AngularFireAuthGuard,
} from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';
import { ScheduleComponent } from './schedule/schedule.component';
import { OfficeListComponent } from './offices/office-list/office-list.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { ScheduleListComponent } from './schedule/schedule-list/schedule-list.component';
import { RequestScheduleComponent } from './schedule/request-schedule/request-schedule.component';
import { NewMaintenanceMultipleComponent } from './maintenances/new-maintenance-multiple/new-maintenance-multiple.component';
import { FullViewExpensesComponent } from './expenses/full-view-expenses/full-view-expenses.component';
import { ExpensesTechnichianComponent } from './expenses/expenses-technichian/expenses-technichian.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/signin']);
const redirectLoggedInToHome = () =>
  map((user) => (user ? ['/expenses'] : true));
const routes: Routes = [
  {
    path: 'signin',
    component: SignInComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
    pathMatch: 'full',
  },
  {
    path: 'schedules',
    component: ScheduleComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'offices',
    component: OfficeListComponent,
    canActivate: [AngularFireAuthGuard, AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'vehicles',
    component: VehicleListComponent,
    canActivate: [AngularFireAuthGuard, AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: '',
    component: MaintenanceListComponent,
    canActivate: [AngularFireAuthGuard, AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'technicians',
    component: TechnicianListComponent,
    canActivate: [AngularFireAuthGuard, AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'contacts',
    component: ContactListComponent,
    canActivate: [AngularFireAuthGuard, AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'expenses',
    component: ExpensesListComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'programming',
    component: ScheduleListComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'new-maintenance',
    component: NewMaintenanceMultipleComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'expense-full-view-reciept/:key',
    component: FullViewExpensesComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'tecnichian-expenses/:key',
    component: ExpensesTechnichianComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
