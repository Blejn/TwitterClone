import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Output() backPage: EventEmitter<boolean> = new EventEmitter<boolean>();
  options: google.maps.MapOptions = {
    center: { lat: 40, lng: -20 },
    zoom: 3,
  };
  constructor() {}

  ngOnInit(): void {}
  moveMap(event: google.maps.MapMouseEvent) {
    console.log(event);
  }
  back() {
    this.backPage.emit(false);
  }
}
