  
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeoMap } from '../models/geomap.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private readonly geocodeAPI = 'https://maps.googleapis.com/maps/api/geocode/json';
  private readonly mapApiKey = 'AIzaSyBMNH4OujQkyQjFn7yvUW1BhaiTAYiQYoA'
  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  async getGeocode(address: string) {
    try {
      let res = <GeoMap>this.http.get(this.geocodeAPI, {
        params: {
          address,
          key: this.mapApiKey
        }
      }).toPromise();
      if (res.status = 'OK') {
        return res;
      } else {
        alert('No coordinates avaliable');
        return null;
      }
    } catch (error) {
      this.openSnackBar(error, 'Cerrar');
    }

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
}
