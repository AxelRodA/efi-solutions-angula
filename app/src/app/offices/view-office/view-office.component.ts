import { OfficeService } from 'src/app/shared/services/office.service';
import { MatDialog } from '@angular/material/dialog';
import { NewContactComponent } from './../../contacts/new-contact/new-contact.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-office',
  templateUrl: './view-office.component.html',
  styleUrls: ['./view-office.component.scss']
})
export class ViewOfficeComponent implements OnInit {

  constructor(public os: OfficeService, private dialog: MatDialog) { }
	
	ngOnInit(): void {
	}
	
	addContactDialog() {
	return this.dialog.open(NewContactComponent, {
	width: '800px',
	});
	}

}
