import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMap, MapMarker as GoogleMapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

export interface MapMarker {
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  info?: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMap, GoogleMapMarker, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnChanges {
  @Input() markers: MapMarker[] = [];

  // Map configuration
  center: google.maps.LatLngLiteral = { lat: 23.8103, lng: 90.4125 }; // Dhaka, Bangladesh
  zoom = 12;
  
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 4,
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers'] && this.markers.length > 0) {
      // Center map to first marker when markers change
      this.center = this.markers[0].position;
    }
  }

  onMarkerClick(marker: MapMarker): void {
    console.log('Marker clicked:', marker);
  }
}