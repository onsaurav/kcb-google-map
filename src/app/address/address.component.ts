import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface AddressSelected {
  address: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AddressComponent,
      multi: true
    }
  ]
})
export class AddressComponent implements OnInit, ControlValueAccessor {
  @Input() className = '';
  @Output() addressSelected = new EventEmitter<AddressSelected>();

  addressSuggestions: google.maps.places.AutocompletePrediction[] = [];
  inputValue = '';

  private autocompleteService!: google.maps.places.AutocompleteService;
  private placesService!: google.maps.places.PlacesService;

  // ControlValueAccessor callbacks
  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    if (!('google' in window)) {
      console.error('Google Maps JavaScript API not loaded.');
      return;
    }

    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const query = target.value;
    this.inputValue = query;

    // Update ngModel with current input text
    this.onChange(this.inputValue);
    this.onTouched();

    if (query.length < 3) {
      this.addressSuggestions = [];
      return;
    }

    this.autocompleteService.getPlacePredictions(
      { input: query },
      (predictions) => {
        this.addressSuggestions = predictions || [];
      }
    );
  }

  onSelect(suggestion: google.maps.places.AutocompletePrediction) {
    this.inputValue = suggestion.description;
    this.addressSuggestions = [];

    this.onChange(this.inputValue); // Update ngModel with selected text

    // Fetch full details (lat/lng)
    this.placesService.getDetails(
      { placeId: suggestion.place_id },
      (details, status) => {
        // Fully safe null checks
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          details?.geometry?.location
        ) {
          const location = details.geometry.location;
          const result: AddressSelected = {
            address: details.formatted_address ?? this.inputValue,
            lat: location.lat(),
            lng: location.lng()
          };

          this.addressSelected.emit(result); // Emit to parent
        }
      }
    );
  }

  writeValue(value: any): void {
    this.inputValue = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}
}
