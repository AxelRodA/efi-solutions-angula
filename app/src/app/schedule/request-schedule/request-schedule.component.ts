import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-request-schedule',
  templateUrl: './request-schedule.component.html',
  styleUrls: ['./request-schedule.component.scss'],
})
export class RequestScheduleComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public scheduleInfo) {}

  ngOnInit(): void {}
}
