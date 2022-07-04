import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';
import * as Highcharts from 'highcharts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //data: any = [];
  weatherData: any = [];
  timeArray: any[] = [];
  localeTimeArray: any[] = [];
  city: any;
  locality: any;
  countryname: any;
  continent: any;
  //x: any;
  //y: any;
  showChart = false;
  highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  tempChartOptions: Highcharts.Options = {};
  humidityChartOptions: Highcharts.Options = {};
  windChartOptions: Highcharts.Options = {};
  cloudChartOptions: Highcharts.Options = {};

  lat: any;
  long: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
  }

  getGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
      });
    } else {
      //Swal.fire('Geolocation is not supported by this browser.');
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'error',
        text: 'Geolocation is not supported by this browser.'
      })
    }
  }

  getForecast(x: number, y: number) {
    if (x == null || y == null) {
      //Swal.fire('Coordinates empty! Please provide the location coordinates');
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'warning',
        text: 'Coordinates empty! Please provide the location coordinates'
      })
      return;
    }
    console.log(`Lat: ${x}, Long:${y}`);

    this.weatherService.getLocation(x, y).subscribe((res) => {
      this.city = res.city;
      this.locality = res.locality;
      this.countryname = res.countryName;
      this.continent = res.continent;
    });

    this.weatherService.getForeCast(x, y).subscribe((res) => {
      this.weatherData = res;
      console.log(this.weatherData);

  
      this.timeArray = [...this.weatherData.hourly.time.slice(6, 19)];
      this.timeArray.forEach((el) => {
        let d = new Date(el).toLocaleTimeString();
        this.localeTimeArray.push(d);
      });

      this.showChart = true;

      this.chartOptions = {
        title: {
          text: `Weather Forecast for ${this.locality || this.city || 'this GPS'}`,
        },
        subtitle: {
          text: `Latitude: ${this.weatherData.latitude}, Longitude: ${this.weatherData.longitude} at ${this.weatherData.elevation}m above sea level`,
        },
        xAxis: {
          title: {
            text: 'Time',
          },
          categories: [...this.localeTimeArray ],
        },
        yAxis: {
          title: {
            text: 'Units',
          },
        },
        series: [
          {
            name: `Temperature (${this.weatherData.hourly_units.temperature_2m})`,
            data: [...this.weatherData.hourly.temperature_2m.slice(6, 19)],
            type: 'spline',
            color: '#F7A35C',
          },
          {
            name: `Humidity (${this.weatherData.hourly_units.relativehumidity_2m})`,
            data: [...this.weatherData.hourly.relativehumidity_2m.slice(6, 19)],
            type: 'spline',
            color: '#434348',
          },
          {
            name: `Wind speed (${this.weatherData.hourly_units.windspeed_120m})`,
            data: [...this.weatherData.hourly.windspeed_120m.slice(6, 19)],
            type: 'spline',
            color: '#90ED7D',
          },
          {
            name: `Cloud cover (${this.weatherData.hourly_units.cloudcover_mid})`,
            data: [...this.weatherData.hourly.cloudcover_mid.slice(6, 19)],
            type: 'spline',
            color: '#7CB5EC',
          },
        ],
        responsive: {  
          rules: [{  
            condition: {  
              maxWidth: 900  
            },  
            chartOptions: {  
              legend: {  
                enabled: true  
              }  
            }  
          }]  
        }
      };

      this.tempChartOptions = {
        title: {
          text: `Temparature Forecast`,
        },
        subtitle: {
          text: `Latitude: ${this.weatherData.latitude}, Longitude: ${this.weatherData.longitude} at ${this.weatherData.elevation}m above sea level`,
        },
        xAxis: {
          title: {
            text: 'Time',
          },
          categories: [...this.localeTimeArray ],
        },
        yAxis: {
          title: {
            text: `${this.weatherData.hourly_units.temperature_2m}`,
          },
        },
        series: [
          {
            name: `Temperature (${this.weatherData.hourly_units.temperature_2m})`,
            data: [...this.weatherData.hourly.temperature_2m.slice(6, 19)],
            type: 'spline',
            color: '#F7A35C',
          },
        ],
      };

      this.humidityChartOptions = {
        title: {
          text: `Humidity Forecast`,
        },
        subtitle: {
          text: `Latitude: ${this.weatherData.latitude}, Longitude: ${this.weatherData.longitude} at ${this.weatherData.elevation}m above sea level`,
        },
        xAxis: {
          title: {
            text: 'Time',
          },
          categories: [...this.localeTimeArray ],
        },
        yAxis: {
          title: {
            text: `${this.weatherData.hourly_units.relativehumidity_2m}`,
          },
        },
        series: [
          {
            name: `Humidity (${this.weatherData.hourly_units.relativehumidity_2m})`,
            data: [...this.weatherData.hourly.relativehumidity_2m.slice(6, 19)],
            type: 'spline',
            color: '#434348',
          },
        ],
      };

      this.windChartOptions = {
        title: {
          text: `Wind Speed Forecast`,
        },
        subtitle: {
          text: `Latitude: ${this.weatherData.latitude}, Longitude: ${this.weatherData.longitude} at ${this.weatherData.elevation}m above sea level`,
        },
        xAxis: {
          title: {
            text: 'Time',
          },
          categories: [...this.localeTimeArray ],
        },
        yAxis: {
          title: {
            text: `${this.weatherData.hourly_units.windspeed_120m}`,
          },
        },
        series: [
          {
            name: `Wind Speed (${this.weatherData.hourly_units.windspeed_120m})`,
            data: [...this.weatherData.hourly.windspeed_120m.slice(6, 19)],
            type: 'spline',
            color: '#90ED7D',
          },
        ],
      };

      this.cloudChartOptions = {
        title: {
          text: `Cloud Cover Forecast`,
        },
        subtitle: {
          text: `Latitude: ${this.weatherData.latitude}, Longitude: ${this.weatherData.longitude} at ${this.weatherData.elevation}m above sea level`,
        },
        xAxis: {
          title: {
            text: 'Time',
          },
          categories: [...this.localeTimeArray ],
        },
        yAxis: {
          title: {
            text: `${this.weatherData.hourly_units.cloudcover_mid}`,
          },
        },
        series: [
          {
            name: `Cloud Cover (${this.weatherData.hourly_units.cloudcover_mid})`,
            data: [...this.weatherData.hourly.cloudcover_mid.slice(6, 19)],
            type: 'spline',
            color: '#7CB5EC',
          },
        ],
      };

    });
  }
}
