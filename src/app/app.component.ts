import { Component } from '@angular/core';
import { MapComponent, MapMarker } from './map/map.component';
import { AddressComponent } from './address/address.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent, AddressComponent, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-maps-app';
  address: string = '';
  selectedAddress: { address: string; lat: number; lng: number } | null = null;

onAddressPicked(event: { address: string; lat: number; lng: number }) {
  this.selectedAddress = event;
  console.log('Selected Address:', this.selectedAddress);
}

  // Sample marker data - you can modify this list
  mapMarkers: MapMarker[] = [
    {
      position: { lat: 23.8103, lng: 90.4125 },
      title: 'Dhaka',
      info: 'Capital of Bangladesh'
    },
    {
      position: { lat: 23.7805, lng: 90.4160 },
      title: 'Mirpur',
      info: 'Residential area'
    },
    {
      position: { lat: 23.7515, lng: 90.3776 },
      title: 'Dhanmondi',
      info: 'Upscale residential area'
    },
    {
      position: { lat: 23.7272, lng: 90.4091 },
      title: 'Old Dhaka',
      info: 'Historic district'
    }
  ];
}