import { Component, OnInit } from '@angular/core';
import { EfisolutionsService } from 'src/app/shared/services/efisolutions.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  constructor(public es: EfisolutionsService) {}

  ngOnInit(): void {}
}
