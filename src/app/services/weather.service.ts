import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  url = 'https://api.open-meteo.com/v1/forecast?latitude=48.8567&longitude=2.3510&hourly=temperature_2m,relativehumidity_2m,cloudcover_mid,windspeed_120m';
  
  constructor(private http: HttpClient) {}

  getAnyForeCast(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getForeCast(lat: any, long: any): Observable<any> {
    return this.http.get<any>(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,cloudcover_mid,windspeed_120m`);
  }

  getLocation(lat: any, long: any) {
    return this.http.get<any>(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`);
  }
}
