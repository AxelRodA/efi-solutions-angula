import { MapsService } from 'src/app/shared/services/maps.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit {
  @Input() lat: number;
  @Input() lng: number;
  constructor(private ms: MapsService) {}

  ngOnInit(): void {}
}
