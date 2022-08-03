import { AuthGuard } from './shared/guards/auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';

// Material components //
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SidenavComponent } from './components/sidenav/sidenav.component';



import { ScheduleComponent } from './schedule/schedule.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { OfficeListComponent } from './offices/office-list/office-list.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { ImportComponent } from './components/import/import.component';
import { NewOfficeComponent } from './offices/new-office/new-office.component';
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list.component';
import { NewVehicleComponent } from './vehicles/new-vehicle/new-vehicle.component';
import { EditVehicleComponent } from './vehicles/edit-vehicle/edit-vehicle.component';
import { NewMaintenanceComponent } from './maintenances/new-maintenance/new-maintenance.component';
import { EditMaintenanceComponent } from './maintenances/edit-maintenance/edit-maintenance.component';
import { MaintenanceListComponent } from './maintenances/maintenance-list/maintenance-list.component';
import { ViewMaintenanceComponent } from './maintenances/view-maintenance/view-maintenance.component';
import { ViewVehicleComponent } from './vehicles/view-vehicle/view-vehicle.component';
import { TechnicianListComponent } from './technicians/technician-list/technician-list.component';
import { NewTechnicianComponent } from './technicians/new-technician/new-technician.component';
import { EditTechnicianComponent } from './technicians/edit-technician/edit-technician.component';
import { ViewTechnicianComponent } from './technicians/view-technician/view-technician.component';
import { EditOfficeComponent } from './offices/edit-office/edit-office.component';
import { ViewOfficeComponent } from './offices/view-office/view-office.component';
import { DeleteComponent } from './components/delete/delete.component';
import { EditVehicleForecastComponent } from './vehicles/edit-vehicle-forecast/edit-vehicle-forecast.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ExpensesListComponent } from './expenses/expenses-list/expenses-list.component';
import { NewExpenseComponent } from './expenses/new-expense/new-expense.component';
import { ChartjsDirective } from './shared/directives/chartjs.directive';
import { NewProjectComponent } from './vehicles/new-project/new-project.component';
import { NewDepositComponent } from './expenses/new-deposit/new-deposit.component';
import { ViewExpenseComponent } from './expenses/view-expense/view-expense.component';
import { NewContactComponent } from './contacts/new-contact/new-contact.component';
import { EditContactComponent } from './contacts/edit-contact/edit-contact.component';
import { ExpenseTableComponent } from './expenses/expenses-list/expense-table/expense-table.component';
import { DepositTableComponent } from './expenses/expenses-list/deposit-table/deposit-table.component';
import { ExpenseMobileViewComponent } from './expenses/expenses-list/expense-mobile-view/expense-mobile-view.component';
import { ExpenseReceiptDialogComponent } from './expenses/expenses-list/expense-receipt-dialog/expense-receipt-dialog.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ViewMaintenancesDetailsComponent } from './maintenances/view-maintenances-details/view-maintenances-details.component';
import { ScheduleListComponent } from './schedule/schedule-list/schedule-list.component';
import { RequestScheduleComponent } from './schedule/request-schedule/request-schedule.component';
import { ScheduleFormComponent } from './schedule/schedule-form/schedule-form.component';
import { EditDepositComponent } from './expenses/edit-deposit/edit-deposit.component';
import { EditExpensesComponent } from './expenses/edit-expenses/edit-expenses.component';
import { NewMaintenanceMultipleComponent } from './maintenances/new-maintenance-multiple/new-maintenance-multiple.component';
import { ExpiredMaintenancesComponent } from './maintenances/expired-maintenances/expired-maintenances.component';
import { FullViewExpensesComponent } from './expenses/full-view-expenses/full-view-expenses.component';
import { ExpensesTechnichianComponent } from './expenses/expenses-technichian/expenses-technichian.component'

@NgModule({
  declarations: [
    AppComponent,
    ScheduleComponent,
    SidenavComponent,
    OfficeListComponent,
    SignInComponent,
    ImportComponent,
    NewOfficeComponent,
    VehicleListComponent,
    NewVehicleComponent,
    EditVehicleComponent,
    NewMaintenanceComponent,
    EditMaintenanceComponent,
    MaintenanceListComponent,
    ViewMaintenanceComponent,
    ViewVehicleComponent,
    TechnicianListComponent,
    NewTechnicianComponent,
    EditTechnicianComponent,
    ViewTechnicianComponent,
    EditOfficeComponent,
    ViewOfficeComponent,
    DeleteComponent,
    EditVehicleForecastComponent,
    ContactListComponent,
    ExpensesListComponent,
    NewExpenseComponent,
    ChartjsDirective,
    NewProjectComponent,
    NewDepositComponent,
    ViewExpenseComponent,
    NewContactComponent,
    EditContactComponent,
    ExpenseTableComponent,
    DepositTableComponent,
    ExpenseMobileViewComponent,
    ExpenseReceiptDialogComponent,
    BulkUploadComponent,
    ViewMaintenancesDetailsComponent,
    ScheduleListComponent,
    RequestScheduleComponent,
    ScheduleFormComponent,
    EditDepositComponent,
    EditExpensesComponent,
    NewMaintenanceMultipleComponent,
    ExpiredMaintenancesComponent,
    FullViewExpensesComponent,
    ExpensesTechnichianComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    //firebase modules
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,

    // Material Components
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatBadgeModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatStepperModule,
    MatExpansionModule,
    MatDividerModule,
    MatTooltipModule,
    MatBottomSheetModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTabsModule,
    MatChipsModule,
    MatRadioModule,
    MatSortModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    
  ],
  providers: [AngularFireAuthGuard,AuthGuard,{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent],
  entryComponents: [ImportComponent, NewOfficeComponent],
})
export class AppModule {}
